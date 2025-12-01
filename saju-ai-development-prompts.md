# AI 사주 분석 웹 애플리케이션 개발 가이드
## Claude Code 단계별 프롬프트

이 문서는 Claude Code를 사용하여 Spring Boot + React 기반의 AI 사주 분석 웹 애플리케이션을 개발하기 위한 단계별 프롬프트입니다.

---

## 📋 프로젝트 개요

**프로젝트명**: SajuAI  
**목적**: 생년월일을 입력받아 Claude API를 활용한 AI 사주 분석 서비스  
**기술 스택**:
- 백엔드: Spring Boot 3.x + Java 17
- 프론트엔드: React 18 + Tailwind CSS
- AI: Anthropic Claude API
- 데이터베이스: H2 (개발용) / MySQL (프로덕션)

---

## 🚀 Phase 1: 백엔드 프로젝트 설정

### 프롬프트 1-1: Spring Boot 프로젝트 초기 설정

```
AI 사주 분석 웹 애플리케이션을 만들고 싶습니다.

프로젝트 요구사항:
- Spring Boot 3.2+ 프로젝트 생성
- Java 17 사용
- Gradle 빌드 시스템
- 패키지명: com.sajuai

필요한 의존성:
- Spring Web
- Spring Data JPA
- H2 Database
- Lombok
- Validation
- Spring Boot DevTools

다음을 생성해주세요:
1. 프로젝트 디렉토리 구조 (backend 폴더)
2. build.gradle 파일
3. application.yml 설정 파일
4. 기본 패키지 구조:
   - controller
   - service
   - repository
   - model
   - dto
   - config
   - exception

프로젝트 루트에 backend 폴더를 만들고 시작해주세요.
```

---

### 프롬프트 1-2: 도메인 모델 및 DTO 생성

```
사주 분석 시스템의 도메인 모델을 만들어주세요.

요구사항:

1. BirthData 엔티티 (model/BirthData.java):
   - id (Long, 자동 생성)
   - year (Integer, 년도)
   - month (Integer, 월)
   - day (Integer, 일)
   - hour (Integer, 시)
   - minute (Integer, 분)
   - gender (Enum: MALE, FEMALE)
   - isLunar (Boolean, 음력 여부)
   - createdAt (LocalDateTime)
   
2. SajuResult 엔티티 (model/SajuResult.java):
   - id (Long, 자동 생성)
   - birthData (BirthData와 OneToOne 관계)
   - yearPillar (String, 년주)
   - monthPillar (String, 월주)
   - dayPillar (String, 일주)
   - hourPillar (String, 시주)
   - personality (Text, 성격 분석)
   - fortune (Text, 운세)
   - career (Text, 직업운)
   - relationship (Text, 애정운)
   - health (Text, 건강운)
   - advice (Text, 조언)
   - luckyColors (String, JSON 배열)
   - luckyNumbers (String, JSON 배열)
   - createdAt (LocalDateTime)

3. DTO 클래스들 (dto 패키지):
   - BirthDataRequest: 생년월일 입력 요청
   - SajuAnalysisResponse: 사주 분석 결과 응답
   - ErrorResponse: 에러 응답

JPA 어노테이션, Lombok, Validation 어노테이션을 모두 적용해주세요.
```

---

### 프롬프트 1-3: 사주 계산 로직 구현

```
전통 사주팔자 계산 로직을 구현해주세요.

service/SajuCalculatorService.java 파일을 만들어주세요.

기능 요구사항:

1. calculateFourPillars(BirthData birthData) 메서드:
   - 입력: 생년월일시
   - 출력: Map<String, String> (년주, 월주, 일주, 시주)
   
2. 계산 로직:
   - 천간(天干): 갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸)
   - 지지(地支): 자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥)
   
3. 계산 방법:
   - 년주: (year - 4) % 60으로 육십갑자 계산
   - 월주: 절입(節入) 기준 계산
   - 일주: 율리우스력 기준 계산
   - 시주: 일간과 시간으로 계산

4. 헬퍼 메서드들:
   - getHeavenlyStem(int index): 천간 반환
   - getEarthlyBranch(int index): 지지 반환
   - getElement(String stem): 오행 반환
   - calculateJulianDay(LocalDate date): 율리우스일 계산

주석을 상세히 달아주세요.
```

---

### 프롬프트 1-4: Claude API 클라이언트 구현

```
Claude API와 통신하는 클라이언트를 만들어주세요.

1. build.gradle에 다음 의존성 추가:
   - OkHttp 4.12.0
   - Gson 2.10.1

2. config/ClaudeApiConfig.java:
   - @Configuration 클래스
   - API 키는 application.yml에서 읽기
   - OkHttpClient 빈 생성
   - 타임아웃: 연결 30초, 읽기 60초

3. service/ClaudeApiService.java:
   - sendAnalysisRequest(String prompt) 메서드
   - Claude API 엔드포인트: https://api.anthropic.com/v1/messages
   - 모델: claude-sonnet-4-20250514
   - max_tokens: 2048
   - 헤더:
     * x-api-key: ${claude.api.key}
     * anthropic-version: 2023-06-01
     * Content-Type: application/json

4. 요청/응답 DTO:
   - ClaudeRequest 클래스
   - ClaudeResponse 클래스
   - Message 클래스

5. 에러 처리:
   - API 호출 실패 시 커스텀 예외 발생
   - 응답 파싱 실패 처리

application.yml에 다음 추가:
```yaml
claude:
  api:
    key: ${CLAUDE_API_KEY:your-api-key-here}
```
```

---

### 프롬프트 1-5: 비즈니스 로직 서비스 구현

```
사주 분석의 핵심 비즈니스 로직을 구현해주세요.

service/SajuAnalysisService.java를 만들어주세요.

기능 요구사항:

1. analyzeSaju(BirthDataRequest request) 메서드:
   
   처리 순서:
   a. BirthData 엔티티 생성 및 저장
   b. SajuCalculatorService로 사주팔자 계산
   c. AI 분석 프롬프트 생성
   d. Claude API 호출
   e. 응답 파싱 (JSON)
   f. SajuResult 엔티티 생성 및 저장
   g. SajuAnalysisResponse DTO 반환

2. buildPrompt(Map<String, String> pillars, BirthData birthData) 메서드:
   
   프롬프트 예시:
   ```
   당신은 전문 사주명리학자입니다. 다음 정보를 바탕으로 상세한 사주 분석을 해주세요.
   
   생년월일: [양력/음력] YYYY년 MM월 DD일 HH시 MM분 ([남성/여성])
   
   사주팔자:
   - 년주: [천간지지] ([오행])
   - 월주: [천간지지] ([오행])
   - 일주: [천간지지] ([오행])
   - 시주: [천간지지] ([오행])
   
   다음 형식의 JSON으로 분석 결과를 작성해주세요:
   {
     "personality": "성격 분석 (200-300자)",
     "fortune": "전반적인 운세 (200-300자)",
     "career": "직업운 및 재물운 (200-300자)",
     "relationship": "애정운 및 대인관계 (200-300자)",
     "health": "건강운 (150-200자)",
     "advice": "조언 및 개운법 (200-300자)",
     "luckyColors": ["색상1", "색상2", "색상3"],
     "luckyNumbers": [숫자1, 숫자2, 숫자3]
   }
   
   JSON 형식만 출력하고 다른 설명은 포함하지 마세요.
   ```

3. parseAnalysisResponse(String responseText) 메서드:
   - JSON 파싱 (```json ``` 제거)
   - Map으로 변환
   - 필드 검증

4. Repository:
   - repository/BirthDataRepository.java
   - repository/SajuResultRepository.java
   
@Transactional 어노테이션과 적절한 예외 처리를 추가해주세요.
```

---

### 프롬프트 1-6: REST API 컨트롤러 구현

```
REST API 엔드포인트를 구현해주세요.

controller/SajuController.java를 만들어주세요.

API 명세:

1. POST /api/saju/analyze
   - 요청: BirthDataRequest JSON
   - 응답: SajuAnalysisResponse JSON
   - 상태 코드: 200 OK, 400 Bad Request, 500 Internal Server Error
   
   요청 예시:
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

2. GET /api/saju/history
   - 최근 분석 이력 조회 (10개)
   - 응답: List<SajuAnalysisResponse>

3. GET /api/saju/{id}
   - 특정 분석 결과 조회
   - 응답: SajuAnalysisResponse

기능 요구사항:
- @RestController, @RequestMapping 사용
- @Valid로 요청 검증
- ResponseEntity로 응답 반환
- @CrossOrigin 설정 (개발 시 localhost:3000 허용)
- Swagger 문서화 (@Operation, @ApiResponse)

추가로 exception/GlobalExceptionHandler.java도 만들어주세요:
- @RestControllerAdvice
- MethodArgumentNotValidException 처리
- IllegalArgumentException 처리
- Exception 처리 (500)
```

---

### 프롬프트 1-7: 백엔드 테스트 및 실행 설정

```
백엔드 프로젝트의 테스트 및 실행 설정을 완성해주세요.

1. application.yml 완성:
```yaml
spring:
  application:
    name: saju-ai
  datasource:
    url: jdbc:h2:mem:sajudb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        
server:
  port: 8080
  
claude:
  api:
    key: ${CLAUDE_API_KEY}
    
logging:
  level:
    com.sajuai: DEBUG
```

2. 기본 테스트 작성:
   - SajuCalculatorServiceTest.java
   - SajuAnalysisServiceTest.java (Mock 사용)
   
3. README.md 작성:
   - 프로젝트 설명
   - 실행 방법
   - API 문서
   - 환경 변수 설정

4. 실행 스크립트 (run.sh):
```bash
#!/bin/bash
export CLAUDE_API_KEY="your-api-key-here"
./gradlew bootRun
```

5. .gitignore 파일 생성
```

---

## 🎨 Phase 2: 프론트엔드 프로젝트 설정

### 프롬프트 2-1: React 프로젝트 초기 설정

```
React 기반의 프론트엔드 프로젝트를 만들어주세요.

프로젝트 루트에 frontend 폴더를 생성하고:

1. React + Vite 프로젝트 생성
2. 필요한 패키지 설치:
   - react-router-dom (라우팅)
   - axios (API 통신)
   - tailwindcss (스타일링)
   - react-datepicker (날짜 선택)
   - react-icons (아이콘)
   - zustand (상태 관리)

3. 프로젝트 구조:
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── BirthForm.jsx
│   │   ├── SajuResult.jsx
│   │   └── HistoryList.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── HistoryPage.jsx
│   ├── api/
│   │   └── sajuApi.js
│   ├── store/
│   │   └── useSajuStore.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   └── main.jsx
├── public/
└── index.html
```

4. Tailwind CSS 설정
5. Vite 설정 (프록시 설정: localhost:8080)
6. package.json 스크립트 설정

실행 명령어도 함께 알려주세요.
```

---

### 프롬프트 2-2: API 통신 레이어 구현

```
백엔드 API와 통신하는 레이어를 구현해주세요.

src/api/sajuApi.js 파일을 만들어주세요.

요구사항:

1. Axios 인스턴스 생성:
   - baseURL: http://localhost:8080/api
   - timeout: 60000 (60초)
   - headers: Content-Type: application/json

2. API 함수들:
   
   - analyzeSaju(birthData):
     * POST /saju/analyze
     * 매개변수: { year, month, day, hour, minute, gender, isLunar }
     * 반환: Promise<분석결과>
   
   - getHistory():
     * GET /saju/history
     * 반환: Promise<Array<분석결과>>
   
   - getSajuById(id):
     * GET /saju/{id}
     * 반환: Promise<분석결과>

3. 에러 처리:
   - 네트워크 에러
   - 4xx, 5xx 상태 코드 처리
   - 타임아웃 처리

4. 인터셉터:
   - 요청 인터셉터: 로딩 시작
   - 응답 인터셉터: 로딩 종료, 에러 처리

예시 코드 구조를 제공해주세요.
```

---

### 프롬프트 2-3: 상태 관리 스토어 구현

```
Zustand를 사용한 전역 상태 관리를 구현해주세요.

src/store/useSajuStore.js 파일을 만들어주세요.

상태 정의:

1. 상태 필드:
   - currentResult: 현재 분석 결과 (null 또는 객체)
   - history: 분석 이력 배열
   - isLoading: 로딩 상태 (boolean)
   - error: 에러 메시지 (null 또는 string)

2. 액션:
   - setCurrentResult(result): 현재 결과 설정
   - addToHistory(result): 이력에 추가
   - setHistory(history): 이력 전체 설정
   - setLoading(isLoading): 로딩 상태 설정
   - setError(error): 에러 설정
   - clearError(): 에러 초기화
   - reset(): 모든 상태 초기화

3. 비동기 액션:
   - fetchAnalysis(birthData): 사주 분석 요청
   - fetchHistory(): 이력 조회

localStorage에 최근 결과를 저장하는 기능도 추가해주세요.
```

---

### 프롬프트 2-4: 생년월일 입력 폼 컴포넌트

```
생년월일 입력 폼 컴포넌트를 만들어주세요.

src/components/BirthForm.jsx 파일을 만들어주세요.

요구사항:

1. 입력 필드:
   - 양력/음력 선택 (라디오 버튼)
   - 생년월일 선택 (DatePicker)
   - 시간 선택 (시: 00-23, 분: 00-59)
   - 성별 선택 (라디오 버튼: 남성/여성)

2. UI 디자인:
   - 모바일 최적화
   - 유튜브/당근 스타일의 깔끔한 디자인
   - Tailwind CSS 사용
   - 카드 형태 레이아웃
   - 그라데이션 배경
   - 부드러운 그림자 효과

3. 유효성 검사:
   - 모든 필드 필수 입력
   - 날짜 범위 검증 (1900-2024)
   - 시간 범위 검증

4. 기능:
   - 입력 중 실시간 유효성 검사
   - 에러 메시지 표시
   - 제출 버튼 (분석하기)
   - 로딩 중에는 버튼 비활성화

5. Props:
   - onSubmit: 제출 핸들러 함수
   - isLoading: 로딩 상태

Tailwind CSS로 아름다운 디자인을 적용해주세요.
```

---

### 프롬프트 2-5: 사주 결과 표시 컴포넌트

```
사주 분석 결과를 표시하는 컴포넌트를 만들어주세요.

src/components/SajuResult.jsx 파일을 만들어주세요.

요구사항:

1. 결과 섹션:
   - 기본 정보 (생년월일, 성별)
   - 사주팔자 (년주, 월주, 일주, 시주)
   - 성격 분석
   - 전반적인 운세
   - 직업운
   - 애정운
   - 건강운
   - 조언
   - 행운의 색상 (컬러 칩 표시)
   - 행운의 숫자

2. UI 디자인:
   - 카드 기반 레이아웃
   - 각 섹션을 아코디언 또는 탭으로 구성
   - 사주팔자는 전통적인 4칸 배치
   - 아이콘 사용 (react-icons)
   - 색상 칩 시각화
   - 애니메이션 효과 (fade-in)

3. 기능:
   - 인쇄 버튼
   - 공유 버튼 (URL 복사)
   - 다시 분석하기 버튼

4. Props:
   - result: 분석 결과 객체
   - onNewAnalysis: 새 분석 핸들러

모바일 반응형으로 만들어주시고, 전통적인 사주 느낌을 살리면서도 모던한 디자인을 적용해주세요.
```

---

### 프롬프트 2-6: 페이지 컴포넌트 구현

```
애플리케이션의 주요 페이지들을 만들어주세요.

1. src/pages/HomePage.jsx:
   - 히어로 섹션 (제목, 설명, CTA 버튼)
   - 특징 소개 (3-4개 카드)
   - 사용 방법 안내
   - 푸터
   - "지금 분석하기" 버튼 → /analysis 이동

2. src/pages/AnalysisPage.jsx:
   - BirthForm 컴포넌트 표시
   - 제출 시 API 호출
   - 로딩 상태 표시
   - 결과 있으면 SajuResult 표시
   - 에러 발생 시 에러 메시지

3. src/pages/HistoryPage.jsx:
   - 최근 분석 이력 목록
   - 각 항목 클릭 시 상세 결과 표시
   - 빈 상태 처리 (분석 이력 없음)
   - 삭제 기능 (옵션)

각 페이지는 다음을 포함:
- 헤더 (내비게이션)
- 메인 콘텐츠
- 푸터

모바일 반응형으로 만들고, 페이지 전환 애니메이션도 추가해주세요.
```

---

### 프롬프트 2-7: 라우팅 및 메인 앱 구성

```
React Router를 사용한 라우팅과 메인 App 컴포넌트를 구성해주세요.

1. src/App.jsx:
   - BrowserRouter 설정
   - Routes 정의:
     * / → HomePage
     * /analysis → AnalysisPage
     * /history → HistoryPage
     * /* → 404 NotFoundPage
   
   - 공통 레이아웃:
     * Header (모든 페이지)
     * Footer (모든 페이지)
     * 페이지 전환 애니메이션

2. src/components/common/Header.jsx:
   - 로고 및 앱 이름
   - 내비게이션 메뉴
   - 모바일 햄버거 메뉴
   - 반응형 디자인

3. src/components/common/Footer.jsx:
   - 저작권 정보
   - 소셜 미디어 링크
   - 이용약관, 개인정보처리방침 링크

4. src/components/common/Loading.jsx:
   - 로딩 스피너
   - 애니메이션 효과

5. src/main.jsx:
   - React 앱 마운트
   - StrictMode 설정

Tailwind CSS로 전체적으로 통일된 디자인을 적용해주세요.
```

---

## 🎨 Phase 3: UI/UX 개선 및 PWA 설정

### 프롬프트 3-1: 디자인 시스템 및 테마 설정

```
전체 애플리케이션의 디자인 시스템을 구축해주세요.

1. tailwind.config.js 커스터마이징:
   - 브랜드 컬러:
     * primary: 보라색 계열 (#8B5CF6)
     * secondary: 청록색 계열 (#06B6D4)
     * accent: 금색 계열 (#F59E0B)
   - 폰트: Noto Sans KR (Google Fonts)
   - 그림자, 둥근 모서리 커스터마이징
   - 애니메이션 설정

2. src/index.css:
   - Tailwind 지시어
   - 전역 스타일
   - 커스텀 CSS 클래스
   - 다크 모드 변수 (옵션)

3. src/utils/classNames.js:
   - 조건부 클래스 네임 유틸리티

4. 공통 컴포넌트:
   - Button.jsx (primary, secondary, outline 스타일)
   - Card.jsx
   - Input.jsx
   - Select.jsx
   - Badge.jsx

전통적인 사주 느낌과 모던한 디자인을 조화롭게 믹스해주세요.
```

---

### 프롬프트 3-2: 애니메이션 및 인터랙션

```
사용자 경험을 향상시키는 애니메이션을 추가해주세요.

1. 페이지 전환 애니메이션:
   - Fade in/out
   - Slide 효과

2. 컴포넌트 등장 애니메이션:
   - BirthForm: 위에서 아래로 슬라이드
   - SajuResult: 각 섹션이 순차적으로 나타남
   - History 항목: Stagger 애니메이션

3. 인터랙션:
   - 버튼 호버 효과
   - 카드 호버 시 약간 확대
   - 입력 필드 포커스 효과
   - 로딩 스피너 (회전 애니메이션)

4. 스크롤 애니메이션:
   - Intersection Observer 사용
   - 뷰포트 진입 시 애니메이션

CSS transition, Tailwind 애니메이션, 또는 framer-motion 라이브러리를 사용해주세요.
```

---

### 프롬프트 3-3: PWA 설정

```
웹 앱을 PWA(Progressive Web App)로 만들어주세요.

1. manifest.json 생성:
   - 앱 이름: "SajuAI - AI 사주 분석"
   - 아이콘: 여러 크기 (192x192, 512x512)
   - theme_color: #8B5CF6
   - background_color: #ffffff
   - display: standalone
   - start_url: /

2. Service Worker 설정:
   - vite-plugin-pwa 사용
   - 오프라인 캐싱 전략
   - 정적 리소스 캐싱
   - API 응답 캐싱 (선택적)

3. index.html 메타 태그:
   - viewport 설정
   - theme-color
   - apple-mobile-web-app-capable
   - apple-touch-icon

4. 설치 프롬프트:
   - "홈 화면에 추가" 버튼
   - beforeinstallprompt 이벤트 처리

5. 오프라인 페이지:
   - 네트워크 연결 없을 때 표시

앱을 홈 화면에 추가하면 네이티브 앱처럼 동작하도록 만들어주세요.
```

---

### 프롬프트 3-4: 반응형 디자인 최적화

```
모든 화면 크기에서 완벽하게 동작하도록 반응형 디자인을 최적화해주세요.

브레이크포인트:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

최적화 요구사항:

1. BirthForm:
   - Mobile: 단일 컬럼
   - Tablet/Desktop: 2컬럼 그리드

2. SajuResult:
   - Mobile: 전체 너비 카드, 스택 레이아웃
   - Tablet: 2컬럼 그리드
   - Desktop: 3컬럼 그리드 (일부 섹션)

3. Header/Navigation:
   - Mobile: 햄버거 메뉴
   - Desktop: 수평 메뉴 바

4. 폰트 크기:
   - Mobile: 작게 (text-sm, text-base)
   - Desktop: 크게 (text-base, text-lg)

5. 터치 최적화:
   - 버튼 최소 크기: 44x44px
   - 충분한 간격

모든 컴포넌트에 Tailwind의 반응형 클래스를 적용해주세요.
```

---

## 🚀 Phase 4: 통합 및 배포

### 프롬프트 4-1: 환경 변수 및 빌드 설정

```
프로덕션 환경을 위한 설정을 완성해주세요.

1. 백엔드 (backend/):
   
   application-prod.yml:
   ```yaml
   spring:
     datasource:
       url: ${DATABASE_URL}
       username: ${DATABASE_USERNAME}
       password: ${DATABASE_PASSWORD}
     jpa:
       hibernate:
         ddl-auto: validate
       show-sql: false
   
   claude:
     api:
       key: ${CLAUDE_API_KEY}
   
   server:
     port: ${PORT:8080}
   ```
   
   build.gradle에 프로덕션 빌드 설정

2. 프론트엔드 (frontend/):
   
   .env.development:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
   
   .env.production:
   ```
   VITE_API_URL=https://your-domain.com/api
   ```
   
   환경 변수 사용하도록 sajuApi.js 수정

3. Docker 설정:
   - backend/Dockerfile
   - frontend/Dockerfile
   - docker-compose.yml

4. 빌드 스크립트:
   - build-all.sh (백엔드 + 프론트엔드 빌드)
```

---

### 프롬프트 4-2: Docker 컨테이너화

```
애플리케이션을 Docker로 컨테이너화해주세요.

1. backend/Dockerfile:
   - OpenJDK 17 베이스 이미지
   - JAR 파일 복사
   - 포트 8080 노출
   - ENTRYPOINT 설정

2. frontend/Dockerfile:
   - Node.js 베이스 이미지 (빌드 단계)
   - Nginx 베이스 이미지 (실행 단계)
   - 빌드된 파일 복사
   - nginx.conf 설정

3. docker-compose.yml:
   ```yaml
   services:
     backend:
       build: ./backend
       ports:
         - "8080:8080"
       environment:
         - CLAUDE_API_KEY=${CLAUDE_API_KEY}
       depends_on:
         - db
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
     
     db:
       image: mysql:8.0
       environment:
         - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
         - MYSQL_DATABASE=sajudb
   ```

4. .dockerignore 파일들

5. README에 Docker 실행 방법 추가
```

---

### 프롬프트 4-3: 에러 처리 및 로깅

```
프로덕션 레벨의 에러 처리와 로깅을 구현해주세요.

백엔드:

1. 커스텀 예외 클래스:
   - exception/SajuException.java
   - exception/ClaudeApiException.java
   - exception/ValidationException.java

2. GlobalExceptionHandler 개선:
   - 상세한 에러 응답
   - HTTP 상태 코드 매핑
   - 에러 로깅

3. 로깅 설정 (logback-spring.xml):
   - 콘솔 로그
   - 파일 로그 (일별 롤링)
   - 레벨별 로그 분리

프론트엔드:

1. 에러 바운더리:
   - components/ErrorBoundary.jsx
   - 컴포넌트 에러 캐치

2. API 에러 처리:
   - 재시도 로직
   - 사용자 친화적 에러 메시지
   - Toast 알림

3. 로깅:
   - console.error 래퍼 함수
   - 프로덕션에서 로그 수준 조정

모든 에러를 우아하게 처리하고 사용자에게 명확한 피드백을 제공해주세요.
```

---

### 프롬프트 4-4: 성능 최적화

```
애플리케이션의 성능을 최적화해주세요.

백엔드:

1. 캐싱:
   - Spring Cache 설정
   - 사주 계산 결과 캐싱
   - Redis 연동 (옵션)

2. 데이터베이스:
   - 인덱스 추가
   - N+1 쿼리 방지
   - 커넥션 풀 설정

3. API 최적화:
   - 응답 압축 (Gzip)
   - 불필요한 데이터 제거

프론트엔드:

1. 코드 스플리팅:
   - React.lazy로 컴포넌트 지연 로딩
   - 라우트 기반 분할

2. 이미지 최적화:
   - WebP 포맷 사용
   - Lazy loading

3. 번들 최적화:
   - Vite 빌드 최적화
   - Tree shaking
   - 불필요한 의존성 제거

4. 메모이제이션:
   - useMemo, useCallback 사용
   - React.memo로 리렌더링 방지

Lighthouse 점수 90+ 목표로 최적화해주세요.
```

---

### 프롬프트 4-5: 보안 강화

```
애플리케이션의 보안을 강화해주세요.

백엔드:

1. CORS 설정:
   - 허용된 도메인만 접근
   - 프로덕션 도메인 설정

2. Rate Limiting:
   - API 요청 제한 (IP당 분당 10회)
   - Bucket4j 라이브러리 사용

3. 입력 검증:
   - XSS 방지
   - SQL Injection 방지
   - 특수문자 필터링

4. HTTPS 강제:
   - 프로덕션에서 HTTPS 리다이렉트

5. 민감 정보 보호:
   - API 키 환경 변수 사용
   - 로그에 민감 정보 출력 금지

프론트엔드:

1. XSS 방지:
   - DOMPurify 라이브러리
   - 사용자 입력 sanitize

2. HTTPS 사용:
   - Mixed content 방지

3. 보안 헤더:
   - Content-Security-Policy
   - X-Frame-Options

OWASP Top 10 보안 취약점을 체크해주세요.
```

---

### 프롬프트 4-6: 배포 가이드 작성

```
프로젝트를 배포하기 위한 상세한 가이드를 작성해주세요.

1. 로컬 개발 환경 설정:
   - 필수 소프트웨어 설치
   - 환경 변수 설정
   - 실행 방법
   - 개발 팁

2. 클라우드 배포 옵션:

   A. AWS 배포:
   - EC2 인스턴스 설정
   - RDS 데이터베이스
   - S3 + CloudFront (프론트엔드)
   - Elastic Beanstalk 사용

   B. Heroku 배포:
   - 백엔드 앱 생성
   - 프론트엔드 앱 생성
   - 환경 변수 설정
   - Git push 배포

   C. Vercel + Railway:
   - Vercel로 프론트엔드 배포
   - Railway로 백엔드 배포

3. Docker 배포:
   - Docker Compose 실행
   - 환경 변수 설정
   - 볼륨 마운트

4. CI/CD 설정 (GitHub Actions):
   - 자동 테스트
   - 자동 빌드
   - 자동 배포

5. 도메인 및 SSL:
   - 도메인 연결
   - Let's Encrypt SSL 인증서

6. 모니터링:
   - 로그 모니터링
   - 에러 트래킹 (Sentry)
   - 성능 모니터링

각 단계별 명령어와 스크린샷을 포함한 상세한 문서를 만들어주세요.
```

---

### 프롬프트 4-7: 최종 테스트 및 문서화

```
프로젝트를 완성하기 위한 최종 작업을 해주세요.

1. 통합 테스트:
   - 전체 사용자 플로우 테스트
   - 엣지 케이스 테스트
   - 여러 브라우저에서 테스트

2. 접근성 개선:
   - ARIA 레이블 추가
   - 키보드 네비게이션
   - 스크린 리더 지원

3. SEO 최적화:
   - 메타 태그 추가
   - Open Graph 태그
   - sitemap.xml
   - robots.txt

4. 종합 README.md:
   ```markdown
   # SajuAI - AI 사주 분석 웹 애플리케이션
   
   ## 프로젝트 소개
   ## 주요 기능
   ## 기술 스택
   ## 설치 및 실행
   ## 프로젝트 구조
   ## API 문서
   ## 배포 가이드
   ## 라이선스
   ## 기여 방법
   ## 문의
   ```

5. API 문서:
   - Swagger UI 설정
   - 엔드포인트별 상세 설명
   - 요청/응답 예시

6. 사용자 가이드:
   - 스크린샷 포함
   - 단계별 사용 방법
   - FAQ

7. 라이선스 파일 (LICENSE)

8. CHANGELOG.md:
   - 버전별 변경 사항

완성도 높은 프로젝트 문서를 만들어주세요.
```

---

## 🎓 추가 기능 (선택사항)

### 프롬프트 5-1: 사용자 인증 (회원가입/로그인)

```
사용자 인증 시스템을 추가해주세요.

백엔드:

1. Spring Security 설정:
   - JWT 토큰 인증
   - 회원가입 API
   - 로그인 API
   - 비밀번호 암호화

2. User 엔티티:
   - username, email, password
   - roles (USER, ADMIN)

3. 분석 결과와 사용자 연결:
   - SajuResult에 user_id 추가
   - 본인 분석만 조회 가능

프론트엔드:

1. 로그인/회원가입 페이지
2. JWT 토큰 저장 (localStorage)
3. API 요청 시 토큰 포함
4. 인증 상태 관리 (Zustand)
5. Protected Routes

간단하면서도 안전한 인증 시스템을 구현해주세요.
```

---

### 프롬프트 5-2: 결과 공유 기능

```
사주 분석 결과를 공유하는 기능을 추가해주세요.

1. 공유 URL 생성:
   - 짧은 URL 생성 (UUID)
   - /share/{shareId} 엔드포인트
   - 공유 기한 설정 (7일)

2. 이미지로 저장:
   - html2canvas 라이브러리
   - 결과를 이미지로 변환
   - 다운로드 기능

3. 소셜 미디어 공유:
   - 카카오톡 공유
   - 페이스북 공유
   - 트위터 공유
   - URL 복사

4. QR 코드 생성:
   - qrcode 라이브러리
   - 공유 URL의 QR 코드

사용자가 쉽게 결과를 공유할 수 있도록 만들어주세요.
```

---

### 프롬프트 5-3: 관리자 대시보드

```
관리자가 서비스를 관리할 수 있는 대시보드를 만들어주세요.

기능:

1. 통계:
   - 일일 분석 요청 수
   - 총 사용자 수
   - API 사용량

2. 사용자 관리:
   - 사용자 목록
   - 사용자 차단/해제

3. 분석 이력 관리:
   - 모든 분석 이력 조회
   - 부적절한 내용 삭제

4. 시스템 모니터링:
   - 서버 상태
   - 에러 로그
   - API 응답 시간

React Admin 또는 커스텀 대시보드로 구현해주세요.
```

---

## 📚 참고 자료

### 유용한 링크:

1. **Spring Boot 문서**: https://spring.io/projects/spring-boot
2. **React 문서**: https://react.dev
3. **Tailwind CSS**: https://tailwindcss.com
4. **Claude API**: https://docs.anthropic.com
5. **Vite**: https://vitejs.dev

### 사주 관련 참고:

- 천간지지 계산 알고리즘
- 오행(五行) 이론
- 십이지신(十二支神)
- 육십갑자(六十甲子)

---

## 🎯 프로젝트 완성 체크리스트

### 백엔드:
- [ ] Spring Boot 프로젝트 설정
- [ ] 도메인 모델 및 JPA 설정
- [ ] 사주 계산 로직 구현
- [ ] Claude API 연동
- [ ] REST API 구현
- [ ] 에러 처리
- [ ] 로깅 설정
- [ ] 테스트 작성

### 프론트엔드:
- [ ] React 프로젝트 설정
- [ ] 라우팅 구성
- [ ] 상태 관리 (Zustand)
- [ ] API 통신 레이어
- [ ] BirthForm 컴포넌트
- [ ] SajuResult 컴포넌트
- [ ] 반응형 디자인
- [ ] PWA 설정

### 배포:
- [ ] 환경 변수 설정
- [ ] Docker 컨테이너화
- [ ] 보안 강화
- [ ] 성능 최적화
- [ ] 배포 가이드
- [ ] 문서화

---

## 💬 개발 팁

1. **점진적 개발**: 각 프롬프트를 순서대로 진행하세요.
2. **테스트**: 각 단계마다 테스트를 작성하고 실행하세요.
3. **커밋**: 기능 완성 시마다 Git 커밋하세요.
4. **문서화**: 코드에 주석을 달고 README를 업데이트하세요.
5. **피드백**: 각 단계에서 Claude Code에게 개선점을 물어보세요.

---

## 🚀 시작하기

이제 첫 번째 프롬프트 (프롬프트 1-1)를 Claude Code에 입력하여 프로젝트를 시작하세요!

```bash
# 프로젝트 폴더 생성
mkdir saju-ai-project
cd saju-ai-project

# Claude Code 시작
claude-code
```

그리고 프롬프트 1-1을 입력하세요!

행운을 빕니다! 🎉
