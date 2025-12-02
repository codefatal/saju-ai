# IntelliJ IDEA 실행 가이드

## 🎯 프로젝트 열기

1. IntelliJ IDEA 실행
2. **Open** 클릭
3. `D:\work\code\saju` 폴더 선택
4. **Trust Project** 클릭

---

## ⚙️ 초기 설정 (한 번만)

### 1. Gradle 설정 확인
- **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
- Gradle JVM: **Java 17** 선택

### 2. Node.js 설정 확인
- **File → Settings → Languages & Frameworks → Node.js**
- Node interpreter가 설정되어 있는지 확인

### 3. Gemini API 키 설정 ⭐ 중요!
- **먼저 무료 API 키 발급**: https://ai.google.dev/
- 실행 구성 파일 수정 필요:
  - `.idea/runConfigurations/Backend__Spring_Boot_.xml` 파일 열기
  - `GEMINI_API_KEY` 값을 실제 API 키로 변경

```xml
<env name="GEMINI_API_KEY" value="실제-API-키-입력" />
```

---

## 🚀 실행 방법

### 방법 1: 전체 실행 (권장) ⭐

1. 상단 툴바에서 실행 구성 선택: **SajuAI (Full Stack)**
2. ▶️ 실행 버튼 클릭 (또는 Shift+F10)
3. 백엔드와 프론트엔드가 동시에 실행됩니다!

### 방법 2: 개별 실행

#### 백엔드만 실행
1. 실행 구성: **Backend (Spring Boot)** 선택
2. ▶️ 실행

#### 프론트엔드만 실행
1. 실행 구성: **Frontend (React)** 선택
2. ▶️ 실행

---

## 🌐 웹 접속 방법

### 일반 사용자 → 프론트엔드 접속
```
http://localhost:3000
```
**👆 이 주소로 접속하세요!**
- 사주 분석 UI가 표시됩니다
- 여기서 생년월일을 입력하고 분석할 수 있습니다

### 개발자/테스트용

#### Swagger API 문서
```
http://localhost:8888/swagger-ui/html
```
- API 명세 확인
- API 직접 테스트 가능

#### 백엔드 직접 호출
```
http://localhost:8888/              # 서버 정보
http://localhost:8888/health        # Health Check
http://localhost:8888/api/saju/history  # 분석 이력
```

#### H2 데이터베이스 콘솔
```
http://localhost:8888/h2-console
```
- JDBC URL: `jdbc:h2:mem:sajudb`
- Username: `sa`
- Password: (비워두기)

---

## ✅ 정상 작동 확인

### 1. 백엔드 확인
콘솔에서 다음 메시지 확인:
```
Started SajuAiApplication in X.XXX seconds
Tomcat started on port(s): 8888
```

### 2. 프론트엔드 확인
콘솔에서 다음 메시지 확인:
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 3. 웹 브라우저에서 테스트
1. `http://localhost:3000` 접속
2. "지금 분석하기" 버튼 클릭
3. 생년월일 입력 폼이 표시되면 성공!

---

## 🛠️ 문제 해결

### "Cannot resolve symbol" 에러
1. **File → Invalidate Caches → Invalidate and Restart**
2. Gradle 재동기화: 우클릭 `build.gradle` → **Reload Gradle Project**

### 포트 충돌 에러
- 8888 포트가 이미 사용 중이라면:
  - `backend/src/main/resources/application.yml`에서 포트 변경
  - `frontend/.env.development`도 같이 변경

### npm install 필요
프론트엔드 최초 실행 전:
```bash
cd frontend
npm install
```

### Gradle Build 실패
```bash
cd backend
gradlew.bat clean build
```

---

## 📱 추천 브라우저

- ✅ Chrome (권장)
- ✅ Edge
- ✅ Firefox
- ⚠️ Safari (일부 기능 제한 가능)

---

## 🎨 개발 팁

### Hot Reload (자동 새로고침)
- **백엔드**: 코드 수정 후 자동 재시작 (DevTools)
- **프론트엔드**: 코드 저장 시 브라우저 자동 새로고침

### 디버깅
- 백엔드: IntelliJ의 디버그 모드 사용
- 프론트엔드: 브라우저 개발자 도구 (F12)

### 로그 확인
- **백엔드**: IntelliJ의 Run 탭
- **프론트엔드**: IntelliJ의 npm 탭 또는 브라우저 콘솔

---

## 📞 문제 발생 시

1. 콘솔 에러 메시지 확인
2. 백엔드/프론트엔드 모두 실행 중인지 확인
3. `GEMINI_API_KEY` 환경 변수 설정 확인
4. 포트 충돌 확인 (8888, 3000)
