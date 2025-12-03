# 모두의사주AI - AI 사주 분석 웹 애플리케이션

생년월일을 입력받아 Google Gemini API를 활용하여 전문적인 사주 분석을 제공하는 풀스택 웹 애플리케이션입니다.

## 🚀 빠른 시작 (IntelliJ 사용자)

**5분만에 실행하기!** 👉 [QUICK_START.md](QUICK_START.md) 참고

**상세한 IntelliJ 설정 가이드** 👉 [INTELLIJ_SETUP.md](INTELLIJ_SETUP.md) 참고

## 프로젝트 개요

**모두의사주AI**는 전통 사주명리학의 계산 방식과 최신 AI 기술을 결합하여, 사용자에게 정확하고 상세한 사주 분석 결과를 제공합니다.

### 주요 기능

- 생년월일시 기반 사주팔자 계산 (천간지지)
- Gemini AI를 활용한 심층 사주 분석
- 성격, 운세, 직업운, 애정운, 건강운 분석
- 행운의 색상 및 숫자 제공
- 분석 이력 저장 및 조회
- 반응형 모바일 최적화 UI

## 기술 스택

### 백엔드
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (개발) / **MySQL** (프로덕션)
- **OkHttp** - HTTP 클라이언트
- **Gson** - JSON 처리
- **Lombok** - 코드 간소화

### 프론트엔드
- **React 18.2.0**
- **Vite 5.0.8**
- **React Router 6.20.0**
- **Zustand 4.4.7** - 상태 관리
- **Axios 1.6.2** - API 통신
- **Tailwind CSS 3.3.6** - 스타일링
- **React Icons** - 아이콘

### AI
- **Google Gemini API**
- Model: `gemini-1.5-flash` (무료 사용 가능)

## 프로젝트 구조

```
saju/
├── backend/                 # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sajuai/
│   │   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   │   ├── service/         # 비즈니스 로직
│   │   │   │   ├── repository/      # 데이터 접근
│   │   │   │   ├── model/           # 엔티티
│   │   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   ├── config/          # 설정
│   │   │   │   └── exception/       # 예외 처리
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── build.gradle
│   └── README.md
│
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── pages/           # 페이지
│   │   ├── api/             # API 통신
│   │   ├── store/           # 상태 관리
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── README.md               # 이 파일
```

## 시작하기

### 필수 요구사항

- **JDK 17** 이상
- **Node.js 16** 이상
- **Gradle 7.x** 이상
- **Gemini API 키** (https://ai.google.dev/ - 무료 발급)

### 1. 환경 변수 설정

```bash
# Gemini API 키 설정 (필수)
export GEMINI_API_KEY=your-gemini-api-key-here
```

Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="your-gemini-api-key-here"
```

**Gemini API 키 발급 방법:**
1. https://ai.google.dev/ 접속
2. "Get API key in Google AI Studio" 클릭
3. "Create API key" 버튼으로 무료 API 키 발급

### 2. 백엔드 실행

```bash
cd backend
gradlew bootRun
```

서버 실행: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui/html

H2 Console: http://localhost:8080/h2-console

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

애플리케이션 실행: http://localhost:3000

## API 문서

### 사주 분석

```http
POST /api/saju/analyze
Content-Type: application/json

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

**응답 예시:**
```json
{
  "id": 1,
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "minute": 30,
  "gender": "MALE",
  "isLunar": false,
  "yearPillar": "경오(庚午) 금(金)",
  "monthPillar": "신사(辛巳) 금(金)",
  "dayPillar": "갑자(甲子) 목(木)",
  "hourPillar": "신미(辛未) 금(金)",
  "personality": "성격 분석 내용...",
  "fortune": "운세 내용...",
  "career": "직업운 내용...",
  "relationship": "애정운 내용...",
  "health": "건강운 내용...",
  "advice": "조언 내용...",
  "luckyColors": ["빨강", "금색", "노랑"],
  "luckyNumbers": [3, 7, 9],
  "createdAt": "2024-01-15T10:30:00"
}
```

### 분석 이력 조회

```http
GET /api/saju/history
```

### 특정 분석 결과 조회

```http
GET /api/saju/{id}
```

## 사주 계산 로직

### 사주팔자란?

사주팔자는 태어난 년, 월, 일, 시를 천간(天干)과 지지(地支)로 표현한 것입니다.

- **천간**: 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)
- **지지**: 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)

### 계산 방법

1. **년주**: 육십갑자 순환 (60년 주기)
2. **월주**: 절입(節入) 기준 계산
3. **일주**: 율리우스력 기준 계산
4. **시주**: 일간과 시간으로 계산

자세한 구현은 `SajuCalculatorService.java`를 참조하세요.

## 배포

### Docker를 사용한 배포

```bash
# 백엔드 빌드
cd backend
./gradlew build

# 프론트엔드 빌드
cd ../frontend
npm run build

# Docker Compose 실행
docker-compose up -d
```

### 환경별 설정

#### 개발 환경
- 백엔드: `application.yml`
- 프론트엔드: `.env.development`

#### 프로덕션 환경
- 백엔드: `application-prod.yml`
- 프론트엔드: `.env.production`

## 스크린샷

### 홈페이지
![홈페이지](docs/images/home.png)

### 사주 분석 입력
![분석 입력](docs/images/analysis-form.png)

### 분석 결과
![분석 결과](docs/images/result.png)

### 분석 이력
![분석 이력](docs/images/history.png)

## 개발 가이드

### 백엔드 개발

```bash
cd backend

# 빌드
./gradlew build

# 테스트
./gradlew test

# 실행
./gradlew bootRun
```

### 프론트엔드 개발

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

## 트러블슈팅

### 백엔드

**문제**: Gemini API 호출 실패
- **해결**: `GEMINI_API_KEY` 환경 변수가 올바르게 설정되었는지 확인
- **해결**: 무료 할당량 초과 여부 확인 (분당 60 요청, 일일 1,500 요청)

**문제**: H2 데이터베이스 연결 오류
- **해결**: `application.yml`의 데이터베이스 설정 확인

### 프론트엔드

**문제**: API 통신 오류
- **해결**: 백엔드 서버가 실행 중인지 확인 (localhost:8080)

**문제**: CORS 오류
- **해결**: `SajuController.java`의 `@CrossOrigin` 설정 확인

## 향후 계획

- [ ] 사용자 인증 및 회원 시스템
- [ ] 사주 결과 공유 기능 (SNS, URL)
- [ ] PWA 지원
- [ ] 다크 모드
- [ ] 음력 변환 정확도 개선
- [ ] 관리자 대시보드
- [ ] 결제 시스템 (프리미엄 분석)

## 기여

기여를 환영합니다! Pull Request를 보내주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

⭐️ **모두의사주AI**로 나의 운명을 알아보세요!
