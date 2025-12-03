# 모두의사주AI - 개발 이력 로그

이 문서는 프로젝트의 모든 개발 이력과 변경사항을 기록합니다.

---

## 📅 2025-12-03

### ✅ 완료된 작업

#### 1. 프로젝트 초기 설정
- **설명**: 기존 SajuAI 프로젝트를 모두의사주AI로 리브랜딩
- **변경 파일**:
  - `frontend/src/components/common/Header.jsx` - 로고 "모두의사주AI"로 변경
  - `frontend/src/components/common/Footer.jsx` - 서비스명 및 저작권 변경
  - `frontend/index.html` - 페이지 타이틀 및 메타 태그 변경
  - `frontend/src/pages/HomePage.jsx` - 메인 타이틀 변경
  - `backend/src/main/resources/application.yml` - 앱 이름 `everyone-saju-ai`로 변경
  - `backend/src/main/java/com/sajuai/service/PdfGenerationService.java` - PDF 제목 업데이트
  - `README.md` - 프로젝트 제목 및 설명 변경
  - `CLAUDE.md` - 프로젝트 개요 변경

#### 2. PDF 다운로드 기능 추가
- **설명**: 사주 분석 결과를 PDF로 다운로드하는 기능
- **백엔드**:
  - `build.gradle` - iText PDF 라이브러리 추가 (`com.itextpdf:itext7-core:7.2.5`)
  - `service/PdfGenerationService.java` - PDF 생성 서비스 (한글 폰트 지원)
  - `controller/SajuController.java` - `GET /api/saju/{id}/pdf` 엔드포인트 추가
  - `service/SajuAnalysisService.java` - `getSajuResultEntity()` 메서드 추가
- **프론트엔드**:
  - `api/sajuApi.js` - `downloadPdf()` 함수 추가 (Blob 처리)
  - `components/SajuResult.jsx` - PDF 다운로드 버튼 추가
- **기능**:
  - 사주팔자, 운세 분석, 행운 요소 포함
  - Windows 맑은 고딕 폰트로 한글 지원
  - 파일명: `saju_result_{id}.pdf`

#### 3. 오늘의 운세 기능 구현 (1-1)
- **설명**: 생년월일 기반 오늘의 운세 제공
- **백엔드**:
  - `model/DailyFortune.java` - 오늘의 운세 엔티티
    - 필드: 전반적운세, 애정운, 재물운, 직업운, 건강운
    - 행운 요소: 색상, 숫자, 방향, 시간대
    - 운세 점수 (0-100)
  - `repository/DailyFortuneRepository.java` - JPA Repository
    - `findByBirthDataAndFortuneDate()` - 날짜별 운세 조회
  - `dto/DailyFortuneRequest.java` - 요청 DTO
  - `dto/DailyFortuneResponse.java` - 응답 DTO
  - `service/DailyFortuneService.java` - 비즈니스 로직
    - 캐싱 기능: 같은 날짜 재조회 시 캐시된 결과 반환
    - Gemini API 호출 최적화
  - `controller/FortuneController.java` - `POST /api/fortune/daily` 엔드포인트
- **프론트엔드**:
  - `pages/DailyFortunePage.jsx` - 오늘의 운세 페이지
  - `components/DailyFortuneResult.jsx` - 운세 결과 표시
    - 운세 점수 시각화 (원형 점수판)
    - 세부 운세 카드 (애정/재물/직업/건강)
    - 행운 요소 표시
  - `api/sajuApi.js` - `getDailyFortune()` 함수 추가
  - `App.jsx` - `/daily-fortune` 라우트 추가
  - `components/common/Header.jsx` - "오늘의운세" 메뉴 추가
- **특징**:
  - 운세 점수별 색상 구분 (녹색/파랑/노랑/빨강)
  - 반응형 디자인
  - 로딩 상태 표시
  - 에러 핸들링

#### 4. 기능 로드맵 문서화
- **파일**: `FEATURES.md` 생성
- **내용**:
  - 8개 카테고리, 30+ 기능 리스트
  - 난이도, 예상 기간, 주요 기술 명시
  - Phase별 개발 우선순위
  - 개발 진행 상황 테이블

#### 4. 오늘의 럭키 아이템 기능 구현 (5-2)
- **설명**: 사주와 오늘 날짜 기반 행운 아이템 추천
- **백엔드**:
  - `dto/LuckyItemsResponse.java` - 럭키 아이템 응답 DTO
    - 행운의 색상, 숫자, 음식, 향, 아이템, 장소
    - 피해야 할 것들
    - 오늘의 한마디
  - `service/LuckyItemsService.java` - 비즈니스 로직
    - Gemini API 호출 (DB 저장 없이)
    - 사주팔자 기반 AI 추천
  - `controller/FortuneController.java` - `POST /api/fortune/lucky-items` 엔드포인트 추가
- **프론트엔드**:
  - `pages/LuckyItemsPage.jsx` - 럭키 아이템 페이지
  - `components/LuckyItemsResult.jsx` - 결과 표시 컴포넌트
    - 색상/숫자/음식/향/아이템/장소 카드
    - 주의사항 표시
    - 오늘의 메시지 강조
  - `api/sajuApi.js` - `getLuckyItems()` 함수 추가
  - `App.jsx` - `/lucky-items` 라우트 추가
  - `components/common/Header.jsx` - "럭키아이템" 메뉴 추가
- **특징**:
  - DB 저장 없이 실시간 생성
  - 다양한 행운 요소 제공
  - 실용적인 일상 아이템 추천
  - 시각적으로 구분된 카드 UI

---

## 🗂️ 프로젝트 구조 (2025-12-03 기준)

### 백엔드 주요 파일
```
backend/src/main/java/com/sajuai/
├── controller/
│   ├── SajuController.java           # 사주 분석 API
│   ├── FortuneController.java        # 운세 API (NEW)
│   └── HomeController.java           # 헬스체크
├── service/
│   ├── SajuAnalysisService.java      # 사주 분석 서비스
│   ├── SajuCalculatorService.java    # 사주팔자 계산
│   ├── GeminiApiService.java         # Gemini API 통신
│   ├── PdfGenerationService.java     # PDF 생성
│   ├── DailyFortuneService.java      # 오늘의 운세
│   └── LuckyItemsService.java        # 오늘의 럭키 아이템 (NEW)
├── repository/
│   ├── BirthDataRepository.java      # 생년월일 데이터
│   ├── SajuResultRepository.java     # 사주 결과
│   └── DailyFortuneRepository.java   # 오늘의 운세 (NEW)
├── model/
│   ├── BirthData.java                # 생년월일 엔티티
│   ├── SajuResult.java               # 사주 결과 엔티티
│   ├── Gender.java                   # 성별 Enum
│   └── DailyFortune.java             # 오늘의 운세 엔티티 (NEW)
├── dto/
│   ├── BirthDataRequest.java         # 생년월일 요청
│   ├── SajuAnalysisResponse.java     # 사주 분석 응답
│   ├── DailyFortuneRequest.java      # 오늘의 운세 요청
│   ├── DailyFortuneResponse.java     # 오늘의 운세 응답
│   ├── LuckyItemsResponse.java       # 오늘의 럭키 아이템 응답 (NEW)
│   ├── GeminiRequest.java            # Gemini 요청
│   └── GeminiResponse.java           # Gemini 응답
├── config/
│   └── GeminiApiConfig.java          # Gemini API 설정
└── exception/
    ├── GeminiApiException.java       # Gemini API 예외
    └── GlobalExceptionHandler.java   # 전역 예외 처리
```

### 프론트엔드 주요 파일
```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Header.jsx                # 헤더 (메뉴 업데이트)
│   │   ├── Footer.jsx                # 푸터
│   │   ├── Loading.jsx               # 로딩 컴포넌트
│   │   └── ErrorMessage.jsx          # 에러 메시지
│   ├── BirthForm.jsx                 # 생년월일 입력 폼
│   ├── SajuResult.jsx                # 사주 분석 결과 (PDF 버튼)
│   ├── DailyFortuneResult.jsx        # 오늘의 운세 결과
│   └── LuckyItemsResult.jsx          # 오늘의 럭키 아이템 결과 (NEW)
├── pages/
│   ├── HomePage.jsx                  # 홈페이지
│   ├── AnalysisPage.jsx              # 사주 분석 페이지
│   ├── DailyFortunePage.jsx          # 오늘의 운세 페이지
│   ├── LuckyItemsPage.jsx            # 오늘의 럭키 아이템 페이지 (NEW)
│   └── HistoryPage.jsx               # 분석 이력 페이지
├── api/
│   └── sajuApi.js                    # API 클라이언트 (함수 추가)
├── store/
│   └── useSajuStore.js               # Zustand 상태 관리
├── App.jsx                           # 라우팅 (라우트 추가)
└── main.jsx                          # 앱 진입점
```

---

## 🔧 API 엔드포인트 (2025-12-03 기준)

### 사주 분석 API
- `POST /api/saju/analyze` - 사주 분석 요청
- `GET /api/saju/history` - 분석 이력 조회
- `GET /api/saju/{id}` - 특정 분석 결과 조회
- `GET /api/saju/{id}/pdf` - PDF 다운로드 (NEW)

### 운세 API
- `POST /api/fortune/daily` - 오늘의 운세 조회
- `POST /api/fortune/lucky-items` - 오늘의 럭키 아이템 조회 (NEW)

### 기타
- `GET /` - 헬스체크
- `GET /swagger-ui/html` - Swagger 문서
- `GET /h2-console` - H2 데이터베이스 콘솔

---

## 📦 주요 의존성

### 백엔드 (build.gradle)
```gradle
dependencies {
    // Spring Boot
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // Database
    runtimeOnly 'com.h2database:h2'
    runtimeOnly 'com.mysql:mysql-connector-j'

    // HTTP Client & JSON
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.google.code.gson:gson:2.10.1'

    // PDF Generation (NEW)
    implementation 'com.itextpdf:itext7-core:7.2.5'

    // Swagger
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

### 프론트엔드 (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 🎯 다음 개발 예정 기능 (FEATURES.md 참조)

### Phase 1: MVP 확장
1. ✅ 사주팔자 분석 (완료)
2. ✅ 오늘의 운세 (완료)
3. 📅 오늘의 럭키 아이템 (다음)
4. 📅 띠별 운세
5. 📅 음력/양력 변환기

### Phase 2: 핵심 기능
1. 궁합 분석
2. 타로 카드
3. 꿈 해몽
4. 길일 선택
5. 운세 공유하기

---

## 💡 개발 시 주의사항

### 환경 변수
```bash
# Gemini API 키 필수
export GEMINI_API_KEY=your-api-key-here

# Windows (PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"
```

### 포트 설정
- 백엔드: `8888` (application.yml)
- 프론트엔드: `3000` (Vite 기본값)

### 데이터베이스
- 개발 환경: H2 인메모리 DB (`jdbc:h2:mem:sajudb`)
- DDL: `create-drop` (재시작 시 초기화)

### API 호출 제한
- Gemini API 무료 할당량: 분당 60 요청, 일일 1,500 요청
- 캐싱을 통해 API 호출 최소화

### 빌드 명령어
```bash
# 백엔드 빌드
cd backend
gradle build -x test

# 프론트엔드 빌드
cd frontend
npm install
npm run build

# 개발 서버 실행
# 백엔드: gradle bootRun
# 프론트엔드: npm run dev
```

---

## 🐛 알려진 이슈

1. **Windows 환경 Gradle Wrapper 문제**
   - 해결: `gradle` 명령어 직접 사용 (wrapper 대신)

2. **PDF 한글 폰트**
   - 현재: Windows 맑은 고딕 사용
   - TODO: 크로스 플랫폼 폰트 지원 필요

---

## 📝 코드 컨벤션

### 백엔드 (Java)
- 패키지: `com.sajuai.*`
- 네이밍: CamelCase (클래스), camelCase (메서드/변수)
- Lombok 사용: `@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`
- 로깅: `@Slf4j` (log.info, log.error)

### 프론트엔드 (React)
- 컴포넌트: PascalCase
- 파일명: PascalCase.jsx
- 스타일: Tailwind CSS 유틸리티 클래스
- 상태 관리: Zustand (필요 시)

---

## 🔄 Git 브랜치 전략

- `main`: 프로덕션 브랜치
- 기능 개발: 직접 main에 커밋

---

## 📚 참고 문서

- `README.md` - 프로젝트 전체 개요
- `CLAUDE.md` - Claude Code 작업 가이드
- `FEATURES.md` - 기능 로드맵
- `DEVELOPMENT_LOG.md` - 이 문서 (개발 이력)

---

#### 5. 띠별 운세 기능 구현 (2-4)
- **설명**: 12띠별 오늘의 운세 제공
- **백엔드**:
  - `model/ChineseZodiac.java` - 12띠 Enum
    - 년도로 띠 계산 (fromYear)
    - 한글명, 한자, 인덱스
  - `dto/ZodiacFortuneRequest.java` - 요청 DTO
  - `dto/ZodiacFortuneResponse.java` - 응답 DTO
    - 종합/애정/재물/직업/건강운 및 각 점수
    - 행운 요소, 주의사항, 조언
  - `service/ZodiacFortuneService.java` - 비즈니스 로직
    - Gemini API 기반 띠별 운세 생성
  - `controller/FortuneController.java` - `POST /api/fortune/zodiac` 엔드포인트 추가
- **프론트엔드**:
  - `pages/ZodiacFortunePage.jsx` - 띠별 운세 페이지
  - `components/ZodiacSelector.jsx` - 12띠 선택 UI
    - 이모지 기반 그리드 레이아웃
    - 출생년도 정보 표시
  - `components/ZodiacFortuneResult.jsx` - 결과 표시
    - 각 운세별 점수 및 프로그레스 바
    - 색상 코딩 (녹색/파랑/노랑/빨강)
    - 행운 요소 카드
  - `api/sajuApi.js` - `getZodiacFortune()` 함수 추가
  - `App.jsx` - `/zodiac-fortune` 라우트 추가
  - `components/common/Header.jsx` - "띠별운세" 메뉴 추가
- **특징**:
  - 12띠 전체 지원
  - 5가지 세부 운세 점수화
  - 시각적 프로그레스 바
  - 이모지로 직관적인 띠 표현

---

**마지막 업데이트**: 2025-12-03
**완료 기능**: 5개 (사주분석, PDF, 오늘의운세, 럭키아이템, 띠별운세)
**다음 작업**: 음력/양력 변환기 (7-1) 또는 다른 기능 선택
