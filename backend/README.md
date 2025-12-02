# SajuAI Backend

Spring Boot 기반 AI 사주 분석 백엔드 서버

## 기술 스택

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Database**: H2 (개발), MySQL (프로덕션)
- **Build Tool**: Gradle
- **AI**: Google Gemini API

## 주요 기능

- 생년월일 기반 사주팔자 계산
- Gemini AI를 활용한 사주 분석
- 분석 결과 저장 및 조회
- REST API 제공

## 환경 설정

### 필수 요구사항

- JDK 17 이상
- Gradle 7.x 이상

### 환경 변수 설정

```bash
# Gemini API 키 설정
export GEMINI_API_KEY=your-gemini-api-key-here
```

Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="your-gemini-api-key-here"
```

**Gemini API 키 발급:**
- https://ai.google.dev/ 에서 무료로 발급 가능
- 무료 할당량: 분당 60 요청, 일일 1,500 요청

## 실행 방법

### 1. 개발 모드로 실행

```bash
cd backend
gradlew bootRun
```

### 2. JAR 빌드 및 실행

```bash
# 빌드
gradlew build

# 실행
java -jar build/libs/saju-ai-0.0.1-SNAPSHOT.jar
```

## API 문서

서버 실행 후 Swagger UI에서 확인:
- URL: http://localhost:8080/swagger-ui/html

### 주요 엔드포인트

#### 1. 사주 분석
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

#### 2. 분석 이력 조회
```http
GET /api/saju/history
```

#### 3. 특정 분석 결과 조회
```http
GET /api/saju/{id}
```

## 프로젝트 구조

```
backend/
├── src/main/java/com/sajuai/
│   ├── controller/        # REST API 컨트롤러
│   ├── service/           # 비즈니스 로직
│   ├── repository/        # 데이터 접근 계층
│   ├── model/             # 엔티티 클래스
│   ├── dto/               # 데이터 전송 객체
│   ├── config/            # 설정 클래스
│   └── exception/         # 예외 처리
├── src/main/resources/
│   └── application.yml    # 애플리케이션 설정
└── build.gradle           # 빌드 설정
```

## H2 데이터베이스 콘솔

개발 모드에서 H2 콘솔 접근:
- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:sajudb
- Username: sa
- Password: (비워두기)

## 개발 가이드

### 사주 계산 로직

`SajuCalculatorService`에서 전통 사주팔자 계산:
- 년주: 육십갑자 기반
- 월주: 절입(節入) 기준
- 일주: 율리우스력 기준
- 시주: 일간과 시간 기준

### Gemini API 통신

`GeminiApiService`에서 AI 분석 요청:
- Model: gemini-1.5-flash
- Max Output Tokens: 2048
- Temperature: 0.7
- Timeout: 60초

## 라이선스

MIT License
