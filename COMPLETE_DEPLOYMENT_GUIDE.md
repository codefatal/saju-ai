# Vercel + Railway 완전 자동 배포 가이드

이 가이드는 GitHub 푸시 시 프론트엔드(Vercel)와 백엔드(Railway)가 자동으로 배포되도록 설정합니다.

---

## 📋 아키텍처 개요

```
GitHub (main 브랜치)
    ↓
┌─────────────────────────────────────┐
│                                     │
├─ Vercel (자동 배포)                 │
│  ├── React Frontend                 │
│  └── URL: https://saju-ai-five.vercel.app
│                                     │
├─ Railway (자동 배포)                │
│  ├── Spring Boot Backend            │
│  ├── PostgreSQL Database            │
│  └── URL: https://xxxxx.up.railway.app
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 배포 단계

### 1단계: Railway 프로젝트 생성 (5분)

#### 1.1 Railway 회원가입
```
1. https://railway.app 접속
2. "Sign up" → "GitHub"로 로그인
3. 저장소 권한 허용
```

#### 1.2 Railway 프로젝트 생성
```
1. Railway 대시보드 접속
2. "New Project" 클릭
3. "Deploy from GitHub" 선택
4. "saju-ai" 저장소 선택
5. "Deploy" 클릭
```

자동으로 배포가 시작됩니다! (첫 배포는 5-10분 소요)

---

### 2단계: Railway PostgreSQL 추가 (2분)

Railway 대시보드:
```
1. Backend 프로젝트에서 "New" 클릭
2. "Database" → "PostgreSQL" 선택
3. 자동으로 DATABASE_URL 환경 변수 생성됨
```

---

### 3단계: Railway 환경 변수 설정 (2분)

Railway 대시보드 → Backend 프로젝트 → Variables:

#### 필수 변수
```
GEMINI_API_KEY = your-gemini-api-key (ai.google.dev에서 발급)
SPRING_PROFILES_ACTIVE = prod
PORT = 8080
```

#### 자동 생성 변수
```
DATABASE_URL = (PostgreSQL 추가 시 자동 생성)
```

---

### 4단계: Vercel 환경 변수 설정 (3분)

#### 4.1 Railway 백엔드 도메인 확인

Railway 대시보드 → Backend 프로젝트 → Settings:
```
도메인: https://xxxxx.up.railway.app
예시: https://saju-ai-backend.up.railway.app
```

#### 4.2 Vercel 환경 변수 설정

Vercel 대시보드 → saju-ai 프로젝트 → Settings → Environment Variables:

```
Key: VITE_API_URL
Value: https://xxxxx.up.railway.app (위에서 확인한 도메인)

Production: https://xxxxx.up.railway.app
Preview: https://xxxxx.up.railway.app
Development: http://localhost:8888/api
```

#### 4.3 Vercel 재배포
```
1. Deployments 탭
2. "Redeploy" 클릭 (가장 최신 배포)
```

---

### 5단계: 테스트 (5분)

#### 5.1 프론트엔드 테스트
```
https://saju-ai-five.vercel.app 접속
→ 사주분석 페이지 이동
→ 데이터 입력 후 "분석하기" 클릭
→ 결과가 나오면 성공!
```

#### 5.2 API 직접 테스트 (선택사항)
```bash
# Swagger UI에서 테스트
https://xxxxx.up.railway.app/swagger-ui/html

# 또는 curl 사용
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

#### 5.3 브라우저 개발자 도구 확인
```
1. https://saju-ai-five.vercel.app 접속
2. F12 열기 → Network 탭
3. API 호출 확인
4. Request URL: https://xxxxx.up.railway.app/api/saju/analyze
```

---

## 🔄 자동 배포 워크플로우

### 이제부터는 이렇게만 하면 됨:

```bash
# 로컬에서 수정
git add .
git commit -m "Add new feature"
git push origin main

# 자동으로:
# 1. GitHub에 푸시됨
# 2. Railway가 감지하고 자동 배포 (5-10분)
#    - Spring Boot 빌드
#    - PostgreSQL 마이그레이션
# 3. Vercel이 감지하고 자동 배포 (2-3분)
#    - React 빌드
#    - 배포 완료
```

---

## 📊 배포 상태 모니터링

### Railway 배포 상태 확인
```
Railway 대시보드
→ Backend 프로젝트
→ Deployments 탭
→ 최신 배포의 상태 확인
```

### Vercel 배포 상태 확인
```
Vercel 대시보드
→ saju-ai 프로젝트
→ Deployments 탭
→ 최신 배포의 상태 확인
```

---

## 🛠️ 파일 설명

### `vercel.json` (프론트엔드 배포)
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- SPA 라우팅 설정 (모든 경로 → index.html)
- 프론트엔드 폴더에서 빌드

### `railway.json` (백엔드 배포)
```json
{
  "builder": "gradle",
  "startCommand": "cd backend && ./gradlew bootRun --args='--spring.profiles.active=prod'"
}
```
- Gradle로 빌드
- 프로덕션 프로필 자동 활성화

### `Procfile` (Railway 대체 설정)
```
web: cd backend && ./gradlew bootRun --args='--spring.profiles.active=prod'
```
- railway.json이 없을 때 사용

### `application-prod.yml` (프로덕션 설정)
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
  jpa:
    hibernate:
      ddl-auto: validate
```
- PostgreSQL 연결
- 환경 변수 사용

---

## ⚙️ 환경 변수 정보

### Railway 환경 변수
| 변수 | 값 | 설명 |
|------|-----|------|
| `GEMINI_API_KEY` | your-api-key | Google Gemini API 키 |
| `SPRING_PROFILES_ACTIVE` | prod | 프로덕션 프로필 |
| `PORT` | 8080 | 서버 포트 |
| `DATABASE_URL` | (자동) | PostgreSQL 연결 URL |

### Vercel 환경 변수
| 변수 | 값 | 설명 |
|------|-----|------|
| `VITE_API_URL` | https://xxxxx.up.railway.app | 백엔드 API URL |

---

## 🐛 문제 해결

### Railway 배포 실패

**오류: "Gradle build failed"**
```
해결:
1. Railway 대시보드 → Logs 탭 확인
2. GEMINI_API_KEY 설정 확인
3. 백엔드 폴더 구조 확인 (backend/build.gradle 존재)
```

**오류: "DATABASE_URL not found"**
```
해결:
1. PostgreSQL 추가 확인
2. Railway 대시보드 → Variables에서 DATABASE_URL 확인
3. application-prod.yml에서 `${DATABASE_URL}` 설정 확인
```

### Vercel 배포 실패

**오류: "Build failed"**
```
해결:
1. Vercel 대시보드 → Deployments → 최신 배포 클릭
2. Build logs 확인
3. npm install 실패 시: node_modules 삭제 후 재푸시
4. vercel.json의 outputDirectory 확인 (frontend/dist)
```

**오류: "API 응답 없음"**
```
해결:
1. VITE_API_URL이 정확한지 확인
2. Railway의 도메인이 변경되지 않았는지 확인
3. Railway의 PORT가 8080으로 설정되어 있는지 확인
4. 브라우저 Console (F12)에서 CORS 에러 확인
```

### API 호출 실패 (CORS 에러)

**오류: "Access to XMLHttpRequest blocked by CORS policy"**
```
원인: 프론트엔드와 백엔드의 도메인이 다름

해결:
1. SajuController에 @CrossOrigin 추가:

@CrossOrigin(origins = {
    "https://saju-ai-five.vercel.app",
    "http://localhost:3000"
})
@RestController
@RequestMapping("/api/saju")
public class SajuController {
    // ...
}

2. 또는 WebConfig에서 글로벌 설정
3. GitHub에 푸시하면 자동 배포
```

---

## 💰 비용 정보

### Railway
- **무료 크레딧**: 월 $5
- **PostgreSQL**: ~$2-3/월
- **Spring Boot 앱**: ~$2-3/월
- **총 예상**: 월 $4-6 (무료 크레딧 내에서 무료)
- **초과 시**: 자동 청구 (최소 과금 없음)

### Vercel
- **프론트엔드**: 무료 (1000개 배포/월)
- **추가 기능**: Pro ($20/월, 선택사항)

### Google Gemini API
- **무료 할당량**: 분당 60 요청, 일일 1,500 요청
- **유료**: 사용량 기반

---

## ✅ 배포 체크리스트

- [ ] Railway 프로젝트 생성
- [ ] PostgreSQL 추가
- [ ] GEMINI_API_KEY 설정
- [ ] Railway 도메인 확인
- [ ] Vercel VITE_API_URL 설정
- [ ] Vercel 재배포
- [ ] 프론트엔드 테스트
- [ ] API 호출 테스트
- [ ] CORS 설정 (필요시)
- [ ] 첫 번째 배포 완료!

---

## 🎯 완료!

이제 다음과 같이 작동합니다:

```
GitHub 푸시
    ↓
Railway 자동 감지 → 백엔드 배포 (5-10분)
    ↓
Vercel 자동 감지 → 프론트엔드 배포 (2-3분)
    ↓
https://saju-ai-five.vercel.app에서 접근 가능
    ↓
API 호출 → https://xxxxx.up.railway.app
```

모든 변경사항이 자동으로 배포됩니다! 🚀
