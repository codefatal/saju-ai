# OAuth 2.0 설정 가이드

이 문서는 Google과 Kakao OAuth 2.0을 설정하고 사주AI 애플리케이션과 통합하는 방법을 설명합니다.

## 목차
1. [Google OAuth 설정](#google-oauth-설정)
2. [Kakao OAuth 설정](#kakao-oauth-설정)
3. [환경 변수 설정](#환경-변수-설정)
4. [백엔드 설정](#백엔드-설정)
5. [테스트](#테스트)

---

## Google OAuth 설정

### 1. Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 상단의 프로젝트 선택 드롭다운 클릭
3. **새 프로젝트** 클릭
4. 프로젝트 이름: `saju-ai` (또는 원하는 이름)
5. **만들기** 클릭

### 2. OAuth 동의 화면 설정

1. 좌측 메뉴에서 **OAuth 동의 화면** 선택
2. 사용자 유형: **외부** 선택
3. **만들기** 클릭
4. 필수 정보 입력:
   - **앱 이름**: 모두의사주AI
   - **사용자 지원 이메일**: 귀사의 이메일
   - **개발자 연락처 정보**: 귀사의 이메일
5. **저장 후 계속** 클릭

### 3. 범위(Scopes) 설정

1. **범위 추가 또는 제거** 클릭
2. 다음 범위 선택:
   - `openid`
   - `email`
   - `profile`
3. **업데이트** 클릭
4. **저장 후 계속** 클릭

### 4. OAuth 2.0 자격증명 생성

1. 좌측 메뉴에서 **사용자 인증 정보** 선택
2. **+ 사용자 인증 정보 만들기** → **OAuth 2.0 클라이언트 ID**
3. 애플리케이션 유형: **웹 애플리케이션** 선택
4. 이름: `saju-ai-web-client` (또는 원하는 이름)
5. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/auth/callback
   http://localhost:5173/auth/callback
   https://yourdomain.com/auth/callback (프로덕션)
   ```
6. **만들기** 클릭
7. 클라이언트 ID와 클라이언트 secret 복사

### 5. 백엔드 설정파일에 추가

`backend/src/main/resources/application.yml`에 다음 추가:

```yaml
oauth:
  google:
    client-id: YOUR_GOOGLE_CLIENT_ID
    client-secret: YOUR_GOOGLE_CLIENT_SECRET
    token-uri: https://oauth2.googleapis.com/token
    userinfo-uri: https://www.googleapis.com/oauth2/v2/userinfo
```

---

## Kakao OAuth 설정

### 1. Kakao Developers에 가입

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 계정 가입 또는 로그인

### 2. 애플리케이션 생성

1. **My Application** 메뉴 선택
2. **애플리케이션 추가하기** 클릭
3. 앱 이름: `모두의사주AI`
4. 사업자명: 귀사 정보
5. **저장** 클릭

### 3. 플랫폼 설정

1. 생성한 애플리케이션 선택
2. **플랫폼** 섹션에서 **Web 플랫폼 추가**
3. 사이트 도메인 추가:
   ```
   localhost:3000
   localhost:5173
   yourdomain.com (프로덕션)
   ```
4. **저장** 클릭

### 4. OAuth 설정

1. **Product Settings** → **Kakao Login** 섹션 확인
2. **활성화 설정** 확인
3. **Redirect URI** 설정:
   ```
   http://localhost:3000/auth/callback
   http://localhost:5173/auth/callback
   https://yourdomain.com/auth/callback (프로덕션)
   ```

### 5. 클라이언트 정보 확인

1. **앱 기본정보** 탭
2. **앱 키** 섹션에서 **REST API 키** 복사
3. **Client Secret** 필요시 발급

### 6. 백엔드 설정파일에 추가

`backend/src/main/resources/application.yml`에 다음 추가:

```yaml
oauth:
  kakao:
    client-id: YOUR_KAKAO_CLIENT_ID
    client-secret: YOUR_KAKAO_CLIENT_SECRET
    token-uri: https://kauth.kakao.com/oauth/token
    userinfo-uri: https://kapi.kakao.com/v2/user/me
```

---

## 환경 변수 설정

### 개발 환경 (.env.development)

`frontend/.env.development` 파일 수정:

```bash
VITE_API_URL=http://localhost:8888/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_KAKAO_CLIENT_ID=YOUR_KAKAO_CLIENT_ID
```

### 프로덕션 환경 (.env.production)

`frontend/.env.production` 파일 수정:

```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_KAKAO_CLIENT_ID=YOUR_KAKAO_CLIENT_ID
```

---

## 백엔드 설정

### application.yml 전체 설정 예시

```yaml
spring:
  application:
    name: saju-ai
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  h2:
    console:
      enabled: true

  datasource:
    url: jdbc:h2:mem:sajudb
    driver-class-name: org.h2.Driver
    username: sa
    password:

server:
  port: 8888

jwt:
  secret: your-secret-key-min-32-characters-long
  access-token-expiration: 3600000
  refresh-token-expiration: 604800000

oauth:
  google:
    client-id: YOUR_GOOGLE_CLIENT_ID
    client-secret: YOUR_GOOGLE_CLIENT_SECRET
    token-uri: https://oauth2.googleapis.com/token
    userinfo-uri: https://www.googleapis.com/oauth2/v2/userinfo

  kakao:
    client-id: YOUR_KAKAO_CLIENT_ID
    client-secret: YOUR_KAKAO_CLIENT_SECRET
    token-uri: https://kauth.kakao.com/oauth/token
    userinfo-uri: https://kapi.kakao.com/v2/user/me

gemini:
  api-key: ${GEMINI_API_KEY}
  model: gemini-1.5-flash
  max-output-tokens: 2048
```

---

## 테스트

### 로그인 플로우 테스트

1. **프론트엔드 개발 서버 시작**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **백엔드 서버 시작**:
   ```bash
   cd backend
   ./gradlew bootRun
   ```

3. **로그인 페이지 접속**:
   ```
   http://localhost:3000/login
   ```

4. **Google 또는 Kakao로 로그인 버튼 클릭**

5. **OAuth 제공자 로그인 완료**

6. **콜백 페이지에서 토큰 수신 및 저장 확인**

### API 엔드포인트 테스트

#### 사용자 정보 조회
```bash
curl -X GET http://localhost:8888/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 사용자 프로필 조회
```bash
curl -X GET http://localhost:8888/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 사용자 프로필 저장
```bash
curl -X POST http://localhost:8888/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "gender": "MALE",
    "isLunar": false
  }'
```

#### 로그아웃
```bash
curl -X POST http://localhost:8888/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

## 트러블슈팅

### Google OAuth 오류

#### 1. "redirect_uri_mismatch" 오류
- **원인**: 설정된 리디렉션 URI와 실제 요청 URI가 불일치
- **해결**: Google Cloud Console에서 리디렉션 URI 재확인

#### 2. "Invalid client_id" 오류
- **원인**: 잘못된 클라이언트 ID
- **해결**: `.env.development` 파일의 `VITE_GOOGLE_CLIENT_ID` 확인

### Kakao OAuth 오류

#### 1. "Invalid redirect uri" 오류
- **원인**: Kakao Developers에 등록되지 않은 리디렉션 URI
- **해결**: Kakao Developers에서 리디렉션 URI 추가

#### 2. "Invalid client id" 오류
- **원인**: 잘못된 클라이언트 ID
- **해결**: `.env.development` 파일의 `VITE_KAKAO_CLIENT_ID` 확인

### 토큰 문제

#### 1. "Invalid or expired token" 오류
- **원인**: 토큰 만료 또는 손상
- **해결**: 새로 로그인하여 새 토큰 획득

#### 2. "Token refresh failed" 오류
- **원인**: Refresh Token 만료 또는 데이터베이스에서 제거됨
- **해결**: 다시 로그인

---

## 보안 주의사항

1. **클라이언트 Secret 보안**:
   - 클라이언트 Secret은 백엔드에만 저장
   - 프론트엔드에는 절대 노출하지 않기

2. **환경 변수 관리**:
   - `.env*` 파일을 `.gitignore`에 추가
   - 민감한 정보는 환경 변수로만 관리

3. **JWT Secret 관리**:
   - `jwt.secret`은 최소 32자 이상의 강력한 문자열
   - 프로덕션에서는 환경 변수로 설정

4. **HTTPS 사용**:
   - 프로덕션에서는 반드시 HTTPS 사용
   - 리디렉션 URI를 HTTPS로 설정

---

## 참고 문서

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao Login 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Spring Security OAuth2 문서](https://spring.io/projects/spring-security-oauth2-resource-server)

---

## 문의

설정 중 문제가 발생하면 각 OAuth 제공자의 공식 문서를 참고하거나 커뮤니티에 문의하세요.
