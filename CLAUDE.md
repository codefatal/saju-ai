# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**모두의사주AI**는 생년월일시를 입력받아 전통 사주팔자를 계산하고, Google Gemini API를 활용하여 심층적인 사주 분석을 제공하는 풀스택 웹 애플리케이션입니다.

- **백엔드**: Spring Boot 3.2.0 + Java 17 + H2/MySQL
- **프론트엔드**: React 18 + Vite + Zustand + Tailwind CSS
- **AI**: Google Gemini API (`gemini-1.5-flash`)

## 개발 환경 설정

### 필수 환경 변수

```bash
# Gemini API 키 (필수)
export GEMINI_API_KEY=your-api-key-here

# Windows (PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"
```

**Gemini API 키 발급:**
1. https://ai.google.dev/ 접속
2. "Get API key in Google AI Studio" 클릭
3. "Create API key" 버튼으로 무료 API 키 발급
4. 무료 할당량: 분당 60 요청, 일일 1,500 요청

### 백엔드 개발

```bash
cd backend

# 빌드
./gradlew build

# 테스트 실행
./gradlew test

# 개발 서버 실행 (포트: 8888)
./gradlew bootRun
```

**주요 엔드포인트:**
- Swagger UI: http://localhost:8888/swagger-ui/html
- H2 Console: http://localhost:8888/h2-console
- API Base: http://localhost:8888/api

### 프론트엔드 개발

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행 (포트: 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

**환경 변수 파일:**
- 개발: `.env.development` → API URL: `http://localhost:8888/api`
- 프로덕션: `.env.production` → API URL 설정 필요

## 아키텍처

### 백엔드 레이어 구조

```
com.sajuai/
├── controller/          # REST API 엔드포인트
│   ├── SajuController   # 사주 분석 API
│   └── HomeController   # 헬스체크
├── service/
│   ├── SajuAnalysisService      # 사주 분석 비즈니스 로직 통합
│   ├── SajuCalculatorService    # 전통 사주팔자 계산 (천간지지)
│   └── GeminiApiService         # Gemini API 호출 및 응답 처리
├── repository/          # JPA Repository
│   ├── BirthDataRepository
│   └── SajuResultRepository
├── model/               # JPA Entity
│   ├── BirthData        # 생년월일시 정보
│   └── SajuResult       # 사주 분석 결과
├── dto/                 # Data Transfer Objects
│   ├── GeminiRequest    # Gemini API 요청 DTO
│   └── GeminiResponse   # Gemini API 응답 DTO
├── config/              # Spring Configuration
│   └── GeminiApiConfig  # Gemini API 설정
└── exception/           # 예외 처리
    ├── GeminiApiException
    └── GlobalExceptionHandler
```

### 사주 계산 로직 흐름

1. **사용자 입력** → `BirthDataRequest` (년월일시, 성별, 음력 여부)
2. **사주팔자 계산** → `SajuCalculatorService`
   - 년주, 월주, 일주, 시주를 천간지지와 오행으로 계산
   - 육십갑자 순환 (60년 주기) 사용
   - 율리우스력 기준 일주 계산
3. **AI 분석** → `GeminiApiService`
   - 계산된 사주팔자를 프롬프트로 전달
   - Gemini API 호출 (maxOutputTokens: 2048, temperature: 0.7)
   - JSON 형식 응답 파싱
4. **결과 저장** → `SajuAnalysisService`
   - `BirthData`와 `SajuResult` 엔티티로 분리 저장
   - 분석 이력 관리

### 프론트엔드 구조

```
src/
├── components/
│   ├── BirthForm.jsx           # 생년월일 입력 폼
│   ├── SajuResult.jsx          # 분석 결과 표시
│   └── common/                 # 공통 컴포넌트
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── Loading.jsx
│       └── ErrorMessage.jsx
├── pages/
│   ├── HomePage.jsx            # 메인 페이지
│   ├── AnalysisPage.jsx        # 분석 페이지
│   └── HistoryPage.jsx         # 이력 조회 페이지
├── api/
│   └── sajuApi.js              # Axios 기반 API 클라이언트
├── store/
│   └── useSajuStore.js         # Zustand 전역 상태 관리
└── App.jsx                     # React Router 설정
```

### 상태 관리 (Zustand)

`useSajuStore.js`는 다음 상태와 액션을 관리합니다:
- **상태**: `currentResult`, `history`, `isLoading`, `error`
- **동기 액션**: `setCurrentResult`, `addToHistory`, `setLoading`, `setError`
- **비동기 액션**: `fetchAnalysis`, `fetchHistory`
- **LocalStorage**: 마지막 분석 결과 자동 저장/로드

## API 규격

### POST /api/saju/analyze

**요청:**
```json
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "gender": "MALE",
  "isLunar": false
}
```

**응답:**
```json
{
  "id": 1,
  "yearPillar": "경오(庚午) 금(金)",
  "monthPillar": "신사(辛巳) 금(金)",
  "dayPillar": "갑자(甲子) 목(木)",
  "hourPillar": "신미(辛未) 금(金)",
  "personality": "AI 분석 성격...",
  "fortune": "AI 분석 운세...",
  "career": "AI 분석 직업운...",
  "relationship": "AI 분석 애정운...",
  "health": "AI 분석 건강운...",
  "advice": "AI 분석 조언...",
  "luckyColors": ["빨강", "금색", "노랑"],
  "luckyNumbers": [3, 7, 9],
  "createdAt": "2024-01-15T10:30:00"
}
```

### GET /api/saju/history
모든 분석 이력 반환 (배열)

### GET /api/saju/{id}
특정 ID의 분석 결과 반환

## 중요 구현 세부사항

### 포트 번호
- 백엔드: **8888** (application.yml에서 설정)
- 프론트엔드: **3000** (Vite 기본값)

### Gemini API 통합
- 모델: `gemini-1.5-flash` (무료 사용 가능)
- API URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- 인증: 쿼리 파라미터로 API 키 전달 (`?key=YOUR_API_KEY`)
- 설정: temperature: 0.7, maxOutputTokens: 2048
- 타임아웃: 60초

### 데이터베이스
- **개발**: H2 인메모리 DB (`jdbc:h2:mem:sajudb`)
- **프로덕션**: MySQL (application-prod.yml에서 설정)
- DDL: `create-drop` (개발), `validate` (프로덕션 권장)

### 천간지지 계산 상수
`SajuCalculatorService.java` 참조:
- 천간(天干): 갑을병정무기경신임계 (10개)
- 지지(地支): 자축인묘진사오미신유술해 (12개)
- 오행(五行): 목화토금수 매핑
- 기준년도: 1984년 = 갑자(甲子)년

## 일반적인 개발 작업

### 새로운 분석 카테고리 추가
1. `SajuResult.java` 엔티티에 필드 추가
2. `SajuAnalysisService.java`의 프롬프트 수정
3. `SajuResult.jsx`에 UI 표시 로직 추가

### API 엔드포인트 추가
1. `SajuController.java`에 메서드 추가
2. `sajuApi.js`에 클라이언트 함수 추가
3. 필요시 `useSajuStore.js`에 액션 추가

### 데이터베이스 스키마 변경
- 개발: H2는 `create-drop`이므로 재시작 시 자동 반영
- 프로덕션: Flyway 또는 Liquibase 사용 권장 (현재 미구현)

## 트러블슈팅

### Gemini API 호출 실패
- `GEMINI_API_KEY` 환경 변수 확인
- API 키 유효성 확인 (https://ai.google.dev/)
- 무료 할당량 초과 여부 확인 (분당 60 요청, 일일 1,500 요청)
- 로그에서 응답 코드 확인 (`GeminiApiService.java`)

### CORS 에러
- `SajuController.java`의 `@CrossOrigin` 설정 확인
- 프론트엔드 `.env.development`의 API URL 확인

### 포트 충돌
- 백엔드 8888 포트 사용 중: `application.yml`에서 `server.port` 변경
- 프론트엔드 3000 포트 사용 중: `npm run dev -- --port 3001`

### H2 데이터베이스 접근
- URL: `http://localhost:8888/h2-console`
- JDBC URL: `jdbc:h2:mem:sajudb`
- Username: `sa`
- Password: (비워둠)

## 작업 현황

### ✅ 완료된 작업
1. **Vercel + Railway 배포 설정** - 자동 CI/CD 구성
2. **PostgreSQL 데이터베이스 연동** - Railway PostgreSQL 통합
3. **CORS 설정 수정** - WebMvcConfigurer → CorsFilter로 변경
4. **포트 바인딩 수정** - Railway 포트 8888로 명시
5. **Lazy Loading 이슈 해결** - BirthData Eager Loading 구현
6. **행운의 색상/숫자 정렬 수정** - justify-center 클래스 추가
7. **PDF 다운로드 기능 제거** - 포맷팅 문제로 인해 완전 제거
8. **Google AdSense 코드 추가** - index.html에 스크립트 삽입
9. **localStorage 기반 분석 이력 영속성** - 로그인 없이 브라우저 기반 저장

### 📋 진행 중인 작업
- 현재 배포 완료 및 정상 운영 중

### 🔄 향후 작업 예정 (우선순위 미정)
- [ ] 로그인/회원가입 기능 구현 (선택사항)
- [ ] 데이터베이스 기반 이력 저장 (로그인 후)
- [ ] AdSense 광고 배치 최적화
- [ ] 모바일 반응형 UI 개선
- [ ] 성능 최적화 (이미지 최적화, 코드 분할)
- [ ] SEO 최적화 (메타 태그, 오픈그래프)
- [ ] 에러 페이지 및 에러 핸들링 개선
- [ ] 분석 결과 공유 기능 추가
- [ ] 다크모드 지원 추가
- [ ] 배치 크론 작업 (일일 운세, 길일 자동 계산)
