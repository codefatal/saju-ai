# SajuAI Frontend

React + Vite 기반 AI 사주 분석 프론트엔드

## 기술 스택

- **React**: 18.2.0
- **Vite**: 5.0.8
- **React Router**: 6.20.0
- **Zustand**: 4.4.7 (상태 관리)
- **Axios**: 1.6.2 (API 통신)
- **Tailwind CSS**: 3.3.6 (스타일링)
- **React Icons**: 4.12.0

## 주요 기능

- 생년월일 입력 폼
- AI 사주 분석 결과 표시
- 분석 이력 조회
- 반응형 디자인
- 모던한 UI/UX

## 설치 및 실행

### 1. 의존성 설치

```bash
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

서버 실행 후: http://localhost:3000

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 4. 프로덕션 미리보기

```bash
npm run preview
```

## 환경 변수

### `.env.development` (개발)
```
VITE_API_URL=http://localhost:8080/api
```

### `.env.production` (프로덕션)
```
VITE_API_URL=https://your-domain.com/api
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── BirthForm.jsx   # 생년월일 입력 폼
│   │   └── SajuResult.jsx  # 사주 결과 표시
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── HomePage.jsx
│   │   ├── AnalysisPage.jsx
│   │   └── HistoryPage.jsx
│   ├── api/                # API 통신
│   │   └── sajuApi.js
│   ├── store/              # 상태 관리 (Zustand)
│   │   └── useSajuStore.js
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── main.jsx            # 엔트리 포인트
│   └── index.css           # 글로벌 스타일
├── public/                 # 정적 파일
├── index.html              # HTML 템플릿
├── vite.config.js          # Vite 설정
├── tailwind.config.js      # Tailwind 설정
└── package.json
```

## 페이지 구성

### 1. 홈페이지 (/)
- 서비스 소개
- 주요 기능 안내
- CTA 버튼

### 2. 사주 분석 (/analysis)
- 생년월일 입력 폼
- AI 분석 결과 표시
- 로딩 및 에러 처리

### 3. 분석 이력 (/history)
- 최근 분석 결과 목록
- 이력 상세 조회

## 스타일 가이드

### 색상 테마

- **Primary**: 보라색 (#8B5CF6)
- **Secondary**: 청록색 (#06B6D4)
- **Accent**: 금색 (#F59E0B)

### 주요 클래스

```css
.card           /* 카드 스타일 */
.btn-primary    /* 기본 버튼 */
.btn-secondary  /* 보조 버튼 */
.input-field    /* 입력 필드 */
.text-gradient  /* 그라데이션 텍스트 */
```

## API 통신

모든 API 요청은 `src/api/sajuApi.js`를 통해 처리됩니다:

```javascript
import { analyzeSaju, getHistory, getSajuById } from './api/sajuApi';

// 사주 분석
const result = await analyzeSaju(birthData);

// 이력 조회
const history = await getHistory();

// 특정 결과 조회
const result = await getSajuById(id);
```

## 상태 관리

Zustand를 사용한 전역 상태 관리:

```javascript
import useSajuStore from './store/useSajuStore';

const { currentResult, isLoading, error, fetchAnalysis } = useSajuStore();
```

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이선스

MIT License
