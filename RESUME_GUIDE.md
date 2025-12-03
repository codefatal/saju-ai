# 작업 재개 가이드

토큰이 만료되거나 세션이 종료된 후 작업을 재개할 때 사용하는 가이드입니다.

---

## 🚀 빠른 재개 체크리스트

### 1. 현재 상태 파악 (1분)
```markdown
1. DEVELOPMENT_LOG.md 최신 항목 확인
2. FEATURES.md에서 다음 구현 기능 확인
3. Git 상태 확인: git status
```

### 2. 개발 환경 설정 (2분)
```bash
# 1. 환경 변수 설정
$env:GEMINI_API_KEY="your-api-key-here"

# 2. 백엔드 실행 (터미널 1)
cd backend
gradle bootRun

# 3. 프론트엔드 실행 (터미널 2)
cd frontend
npm run dev
```

### 3. 다음 기능 구현 시작
- FEATURES.md에서 다음 기능 확인
- 아래 구현 템플릿 사용

---

## 📋 현재 진행 상황 (2025-12-03)

### ✅ 완료된 기능
1. 사주팔자 분석 (기본 기능)
2. PDF 다운로드
3. 오늘의 운세 (1-1)

### 🎯 다음 개발 기능
**오늘의 럭키 아이템 (5-2)**
- 난이도: ⭐ 쉬움
- 예상 기간: 1일
- 위치: FEATURES.md 라인 253

---

## 🔧 새 기능 구현 템플릿

### 백엔드 구현 순서
```
1. Entity 생성 (model/)
   - @Entity, @Table, @Getter, @Setter, @Builder
   - 필요한 필드 정의
   - @CreationTimestamp 추가

2. Repository 생성 (repository/)
   - JpaRepository 상속
   - 필요한 조회 메서드 정의

3. DTO 생성 (dto/)
   - Request DTO (요청)
   - Response DTO (응답)
   - @Valid 어노테이션 추가

4. Service 생성 (service/)
   - 비즈니스 로직 구현
   - Gemini API 호출 (필요시)
   - @Transactional 추가

5. Controller 생성 (controller/)
   - @RestController, @RequestMapping
   - @Operation (Swagger 문서)
   - @CrossOrigin 추가

6. 빌드 테스트
   cd backend && gradle build -x test
```

### 프론트엔드 구현 순서
```
1. API 클라이언트 추가 (api/sajuApi.js)
   - export const functionName = async () => {}

2. 페이지 컴포넌트 생성 (pages/)
   - useState로 상태 관리
   - 에러 핸들링

3. 결과 컴포넌트 생성 (components/)
   - props로 데이터 받기
   - Tailwind CSS 스타일링

4. 라우터 추가 (App.jsx)
   - import 추가
   - <Route path="/..." element={<Component />} />

5. 네비게이션 추가 (Header.jsx)
   - navItems에 추가
```

---

## 📁 주요 파일 위치

### 문서
- `DEVELOPMENT_LOG.md` - 개발 이력 (여기 업데이트!)
- `FEATURES.md` - 기능 로드맵
- `CLAUDE.md` - 프로젝트 개요
- `README.md` - 전체 문서

### 백엔드 핵심 파일
- `backend/src/main/resources/application.yml` - 설정
- `backend/src/main/java/com/sajuai/`
  - `controller/` - API 엔드포인트
  - `service/` - 비즈니스 로직
  - `model/` - 데이터 엔티티
  - `repository/` - DB 접근

### 프론트엔드 핵심 파일
- `frontend/src/`
  - `App.jsx` - 라우팅
  - `api/sajuApi.js` - API 클라이언트
  - `pages/` - 페이지 컴포넌트
  - `components/` - 재사용 컴포넌트

---

## 🎨 UI 컴포넌트 재사용

### Tailwind CSS 클래스
```jsx
// 카드
<div className="card">

// 버튼 (Primary)
<button className="btn-primary">

// 버튼 (Secondary)
<button className="btn-secondary">

// 제목 (그라데이션)
<h1 className="text-gradient">

// 로딩 스피너
<div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
```

### 아이콘 사용
```jsx
import { FaStar, FaHeart, FaMoneyBill } from 'react-icons/fa';

<FaStar className="text-2xl text-primary-500" />
```

---

## 🔍 디버깅 체크포인트

### 백엔드 오류 시
1. 로그 확인: 콘솔 출력 (log.info, log.error)
2. Swagger UI 테스트: http://localhost:8888/swagger-ui/html
3. H2 Console 확인: http://localhost:8888/h2-console
4. 빌드 재실행: `gradle clean build -x test`

### 프론트엔드 오류 시
1. 브라우저 콘솔 확인 (F12)
2. 네트워크 탭에서 API 응답 확인
3. React DevTools로 상태 확인
4. `npm install` 재실행

### CORS 오류
- `controller/`의 `@CrossOrigin` 확인
- 포트 번호 확인 (백엔드 8888, 프론트 3000)

---

## 💾 작업 완료 후

### 1. 문서 업데이트
```markdown
1. DEVELOPMENT_LOG.md 업데이트
   - 완료 작업 추가
   - 변경 파일 목록
   - API 엔드포인트 (필요시)

2. FEATURES.md 업데이트
   - 상태를 📅 → ✅로 변경
   - 구현 내용 추가

3. README.md 업데이트 (필요시)
   - 주요 기능 추가
```

### 2. 빌드 확인
```bash
# 백엔드
cd backend
gradle build -x test

# 프론트엔드
cd frontend
npm run build
```

### 3. Git 커밋 (선택)
```bash
git add .
git commit -m "feat: 기능명 구현"
git push
```

---

## 🤖 Claude Code 작업 요청 예시

### 작업 재개 시
```
"DEVELOPMENT_LOG.md를 확인하고 다음 기능을 구현해줘"
또는
"FEATURES.md에서 5-2 오늘의 럭키 아이템 기능을 구현해줘"
```

### 기능 구현 시
```
"[기능명] 기능을 구현해줘.
백엔드는 [요구사항],
프론트엔드는 [요구사항]으로 만들어줘"
```

### 디버깅 시
```
"[파일명]에서 [오류 메시지] 오류가 발생해. 해결해줘"
```

---

## 📞 주요 참조 정보

### API 베이스 URL
- 개발: `http://localhost:8888/api`
- Swagger: `http://localhost:8888/swagger-ui/html`

### 프론트엔드 URL
- 개발: `http://localhost:3000`

### 데이터베이스 (H2)
- URL: `jdbc:h2:mem:sajudb`
- Username: `sa`
- Password: (비어있음)
- Console: `http://localhost:8888/h2-console`

### Gemini API
- 모델: `gemini-1.5-flash`
- 무료 할당량: 분당 60 요청, 일일 1,500 요청
- API 키: 환경 변수 `GEMINI_API_KEY`

---

## 📊 프로젝트 현황 요약

### 기술 스택
- **백엔드**: Spring Boot 3.2.0 + Java 17 + H2
- **프론트엔드**: React 18 + Vite + Tailwind CSS
- **AI**: Google Gemini API (gemini-1.5-flash)
- **추가**: iText PDF, Zustand, React Router

### 주요 기능
1. ✅ 사주팔자 분석 (년/월/일/시주, AI 분석)
2. ✅ PDF 다운로드 (한글 지원)
3. ✅ 오늘의 운세 (세부 운세, 행운 요소)
4. 📅 30+ 추가 기능 예정

### 코드 규모 (대략)
- 백엔드: ~20 파일 (Java)
- 프론트엔드: ~15 파일 (JSX)
- 총 라인: ~5,000+ 줄

---

**이 가이드를 사용하여 언제든지 작업을 재개할 수 있습니다!**

**마지막 업데이트**: 2025-12-03
