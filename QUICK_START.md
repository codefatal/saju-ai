# 🚀 빠른 시작 가이드

## 1️⃣ IntelliJ에서 프로젝트 열기

```
File → Open → D:\work\code\saju 폴더 선택
```

---

## 2️⃣ API 키 설정 ⭐ 필수!

먼저 **Gemini API 키 발급**: https://ai.google.dev/ (무료)

파일: `.idea/runConfigurations/Backend__Spring_Boot_.xml`

다음 줄을 찾아서 수정:
```xml
<env name="GEMINI_API_KEY" value="여기에-실제-API-키-입력" />
```

---

## 3️⃣ 실행하기

IntelliJ 상단 툴바에서:

1. 실행 구성 선택: **SajuAI (Full Stack)**
2. ▶️ 실행 버튼 클릭
3. 완료! 🎉

---

## 4️⃣ 웹 브라우저에서 접속

```
http://localhost:3000
```

**이 주소로 접속하면 사주 분석 사이트가 열립니다!**

---

## ✅ 정상 작동 확인

✔️ IntelliJ 콘솔에 "Started SajuAiApplication" 표시
✔️ IntelliJ 콘솔에 "Local: http://localhost:3000/" 표시
✔️ 브라우저에서 사이트 정상 표시

모두 확인되면 성공! 🎊

---

## 🎯 사주 분석 해보기

1. "지금 분석하기" 버튼 클릭
2. 생년월일, 시간, 성별 입력
3. "사주 분석하기" 버튼 클릭
4. AI가 분석한 결과 확인!

---

## ❓ 문제가 생긴다면?

상세한 문제 해결은 `INTELLIJ_SETUP.md` 파일을 참고하세요.

가장 흔한 문제:
- **API 키 미설정**: 2️⃣ 단계 확인
- **포트 충돌**: 8888, 3000 포트가 사용 중인지 확인
- **npm install 필요**: 프론트엔드 폴더에서 `npm install` 실행
