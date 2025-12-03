# Railway 배포 가이드

## 1단계: Railway 회원가입 및 프로젝트 생성

### 회원가입
1. https://railway.app 접속
2. **Sign up** → GitHub로 로그인 (권장)
3. 이메일 인증 완료

### 프로젝트 생성
1. **New Project** 클릭
2. **Deploy from GitHub** 선택
3. **saju-ai** 저장소 선택
4. **Deploy** 클릭

---

## 2단계: PostgreSQL 데이터베이스 연결

### Railway에서 PostgreSQL 추가
1. **New** → **Database** → **PostgreSQL**
2. 자동으로 `DATABASE_URL` 환경 변수가 생성됨

---

## 3단계: 환경 변수 설정

Railway 대시보드에서 다음 환경 변수를 설정합니다:

```
GEMINI_API_KEY=your-gemini-api-key
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

### 설정 방법
1. Railway 대시보드 → Variables 탭
2. 각 변수 입력
3. Deploy 클릭

---

## 4단계: 빌드 설정 확인

Railway는 자동으로 감지하지만, 명시적으로 설정하려면:

### railway.json 생성 (선택사항)
```json
{
  "builder": "gradle",
  "buildCommand": "cd backend && ./gradlew build -x test",
  "startCommand": "cd backend && ./gradlew bootRun --args='--spring.profiles.active=prod'"
}
```

또는 **Procfile** (이미 생성됨) 사용:
```
web: cd backend && ./gradlew bootRun --args='--spring.profiles.active=prod'
```

---

## 5단계: 배포

### 자동 배포 (권장)
- GitHub main 브랜치에 푸시하면 자동으로 배포됨
- Railway 대시보드에서 배포 진행상황 확인

### 수동 배포
```bash
npm install -g @railway/cli
railway login
railway link  # 프로젝트 연결
railway up    # 배포
```

---

## 6단계: 백엔드 URL 확인

1. Railway 대시보드에서 Backend 프로젝트 선택
2. **Settings** → **Domain** 확인
3. 기본값: `https://xxxxx.up.railway.app`

예: `https://saju-ai-backend-prod.up.railway.app`

---

## 7단계: 프론트엔드 환경 변수 업데이트

### Vercel 대시보드 설정
1. Vercel 대시보드 → Project Settings
2. **Environment Variables**에 추가:
   ```
   Key: VITE_API_URL
   Value: https://xxxxx.up.railway.app
   ```
3. 재배포

### 또는 로컬에서 설정
```bash
cd frontend
echo "VITE_API_URL=https://xxxxx.up.railway.app" > .env.production
```

---

## 8단계: 테스트

### 프론트엔드 테스트
1. https://saju-ai-five.vercel.app 접속
2. 사주분석 기능 테스트
3. 브라우저 개발자 도구 (F12) → Network 탭에서 API 호출 확인

### 백엔드 API 직접 테스트
```bash
# Swagger UI
https://xxxxx.up.railway.app/swagger-ui/html

# 또는 curl
curl -X POST https://xxxxx.up.railway.app/api/saju/analyze \
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

---

## 9단계: CORS 설정 (필요시)

프론트엔드에서 API 호출 시 CORS 에러 발생하면:

### 백엔드 설정 (SajuController.java)
```java
@CrossOrigin(origins = {
    "https://saju-ai-five.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
})
@RestController
@RequestMapping("/api/saju")
public class SajuController {
    // ...
}
```

또는 글로벌 CORS 설정:
```java
// WebConfig.java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://saju-ai-five.vercel.app", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## 10단계: 문제 해결

### 배포 실패
1. Railway 대시보드 → Logs 탭에서 오류 확인
2. 일반적인 원인:
   - `GEMINI_API_KEY` 미설정
   - Java 버전 불일치 (17 필수)
   - Gradle 빌드 실패

### 데이터베이스 연결 실패
1. `DATABASE_URL` 환경 변수 확인
2. PostgreSQL이 정상 작동하는지 확인
3. `application-prod.yml`에서 `ddl-auto: validate` 확인

### API 응답 느림
1. Railway 리전 확인 (한국 근처 리전 선택)
2. 무료 플랜은 비활성 시간 후 시작 시간이 걸림
3. 유료 플랜으로 업그레이드 권장

---

## 비용 안내

### Railway 프리 플랜
- 월 $5 크레딧 무료 제공
- PostgreSQL 데이터베이스: ~$2-3/월
- Spring Boot 애플리케이션: ~$2-3/월
- **총 예상: 월 $4-6 (크레딧 내 무료)**

### 업그레이드
- 크레딧 소진 후 자동 청구
- 최소 과금 없음
- 필요시 결제 수단 등록

---

## 완료!

이제 다음 아키텍처로 배포됨:
```
GitHub
  ↓
Railway (자동 배포)
  ├── Spring Boot Backend + PostgreSQL
  └─ URL: https://xxxxx.up.railway.app

Vercel (자동 배포)
  └── React Frontend
      └─ URL: https://saju-ai-five.vercel.app
```

모든 변경사항이 GitHub에 푸시되면 자동으로 배포됩니다! 🚀
