# 배포 및 데이터베이스 연동 가이드

## 1. Vercel 배포 (404 에러 해결)

### 문제 원인
React Router를 사용하는 SPA(Single Page Application)에서는 모든 라우트를 `index.html`로 리다이렉트해야 합니다.
기본 설정이 없으면 새로고침 시 서버에서 직접 경로를 찾으려고 해서 404 에러가 발생합니다.

### 해결 방법 (이미 적용됨)
`vercel.json`에 다음 설정이 추가되었습니다:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**설명:**
- `buildCommand`: Vite로 빌드
- `outputDirectory`: 빌드된 파일의 위치 (Vite는 `dist` 폴더 생성)
- `rewrites`: 모든 라우트를 `index.html`로 리다이렉트 (React Router가 처리)

### 배포 단계

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Add Vercel configuration for SPA routing"
   git push origin main
   ```

2. **Vercel 대시보드 확인**
   - https://vercel.com/codefatals-projects/saju-ai 접속
   - 자동 배포되거나 수동으로 재배포 클릭

3. **환경 변수 설정 (Vercel 대시보드)**
   - Project Settings → Environment Variables
   - `VITE_API_URL` 추가:
     ```
     Production: https://your-backend-api.com/api
     Preview: https://your-backend-api.com/api
     ```

### 로컬에서 프로덕션 빌드 테스트
```bash
cd frontend
npm run build
npm run preview
```

---

## 2. Supabase 데이터베이스 연동

### Supabase 프로젝트 생성

1. **회원가입 및 프로젝트 생성**
   - https://app.supabase.com 접속
   - "New project" 클릭
   - 프로젝트명: `saju-ai`
   - 리전: `ap-southeast-1` (Singapore) - 한국에서 가장 빠름
   - 강력한 비밀번호 설정

2. **API 키 확인**
   - Project Settings → API
   - `anon public` 키 복사 (프론트엔드용)
   - `service_role` 키 복사 (백엔드용)

### 필수 테이블 스키마

#### 1. `birth_data` 테이블
```sql
CREATE TABLE birth_data (
  id BIGSERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  day INTEGER NOT NULL,
  hour INTEGER NOT NULL,
  minute INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
  is_lunar BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_birth_data_created_at ON birth_data(created_at);
```

#### 2. `saju_result` 테이블
```sql
CREATE TABLE saju_result (
  id BIGSERIAL PRIMARY KEY,
  birth_data_id BIGINT NOT NULL REFERENCES birth_data(id) ON DELETE CASCADE,
  year_pillar VARCHAR(50) NOT NULL,
  month_pillar VARCHAR(50) NOT NULL,
  day_pillar VARCHAR(50) NOT NULL,
  hour_pillar VARCHAR(50) NOT NULL,
  personality TEXT,
  fortune TEXT,
  career TEXT,
  relationship TEXT,
  health TEXT,
  advice TEXT,
  lucky_colors VARCHAR(500),
  lucky_numbers VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saju_result_birth_data ON saju_result(birth_data_id);
CREATE INDEX idx_saju_result_created_at ON saju_result(created_at);
```

#### 3. `history` 테이블 (더 빠른 쿼리용)
```sql
CREATE TABLE history (
  id BIGSERIAL PRIMARY KEY,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER NOT NULL,
  birth_minute INTEGER NOT NULL,
  gender TEXT NOT NULL,
  is_lunar BOOLEAN NOT NULL,
  year_pillar VARCHAR(50) NOT NULL,
  month_pillar VARCHAR(50) NOT NULL,
  day_pillar VARCHAR(50) NOT NULL,
  hour_pillar VARCHAR(50) NOT NULL,
  personality TEXT,
  fortune TEXT,
  career TEXT,
  relationship TEXT,
  health TEXT,
  advice TEXT,
  lucky_colors VARCHAR(500),
  lucky_numbers VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_created_at ON history(created_at);
```

### Row Level Security (RLS) 설정

#### 공개 읽기, 인증된 사용자만 쓰기
```sql
-- birth_data 테이블
ALTER TABLE birth_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON birth_data FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON birth_data FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- saju_result 테이블
ALTER TABLE saju_result ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON saju_result FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON saju_result FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- history 테이블
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON history FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON history FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### 백엔드 연동 (Spring Boot)

#### 1. 의존성 추가 (`build.gradle`)
```gradle
dependencies {
  implementation 'io.github.supabase:postgrest-kt:1.0.0'
  implementation 'com.squareup.okhttp3:okhttp:4.11.0'
  implementation 'com.google.code.gson:gson:2.10.1'
}
```

#### 2. Supabase 설정 클래스
```java
// src/main/java/com/sajuai/config/SupabaseConfig.java
package com.sajuai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import javax.sql.DataSource;

@Configuration
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${supabase.db.host}")
    private String dbHost;

    @Value("${supabase.db.port}")
    private String dbPort;

    @Value("${supabase.db.name}")
    private String dbName;

    @Value("${supabase.db.username}")
    private String dbUsername;

    @Value("${supabase.db.password}")
    private String dbPassword;

    @Bean
    public DataSource supabaseDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(String.format("jdbc:postgresql://%s:%s/%s",
            dbHost, dbPort, dbName));
        dataSource.setUsername(dbUsername);
        dataSource.setPassword(dbPassword);
        return dataSource;
    }
}
```

#### 3. 환경 변수 설정 (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${SUPABASE_DB_HOST}:${SUPABASE_DB_PORT}/${SUPABASE_DB_NAME}
    username: ${SUPABASE_DB_USERNAME}
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # Supabase는 validate 사용
    database-platform: org.hibernate.dialect.PostgreSQLDialect

supabase:
  url: ${SUPABASE_URL}
  service-role-key: ${SUPABASE_SERVICE_ROLE_KEY}
  db:
    host: ${SUPABASE_DB_HOST}
    port: ${SUPABASE_DB_PORT}
    name: ${SUPABASE_DB_NAME}
    username: ${SUPABASE_DB_USERNAME}
    password: ${SUPABASE_DB_PASSWORD}
```

#### 4. 환경 변수 설정 (로컬/배포 서버)
```bash
# Windows PowerShell
$env:SUPABASE_URL="https://xxxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
$env:SUPABASE_DB_HOST="db.xxxxx.supabase.co"
$env:SUPABASE_DB_PORT="5432"
$env:SUPABASE_DB_NAME="postgres"
$env:SUPABASE_DB_USERNAME="postgres"
$env:SUPABASE_DB_PASSWORD="your-database-password"
$env:GEMINI_API_KEY="your-gemini-api-key"
```

### 프론트엔드 연동 (선택사항)

#### 1. Supabase 클라이언트 설치
```bash
cd frontend
npm install @supabase/supabase-js
```

#### 2. Supabase 초기화 (`src/lib/supabaseClient.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

#### 3. 환경 변수 설정 (`.env.production`)
```
VITE_API_URL=https://your-backend-api.com/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 3. 데이터 마이그레이션 (H2 → Supabase)

H2 데이터베이스에서 Supabase로 데이터 이관:

```bash
# 1. H2에서 데이터 내보내기
# H2 Console에서 SQL 실행:
SELECT * FROM birth_data;
SELECT * FROM saju_result;

# 2. CSV로 저장

# 3. Supabase에 임포트
# Supabase Dashboard → SQL Editor → 쿼리 실행
COPY birth_data(year, month, day, hour, minute, gender, is_lunar, created_at)
FROM STDIN WITH (FORMAT CSV);

COPY saju_result(...)
FROM STDIN WITH (FORMAT CSV);
```

---

## 4. 배포 체크리스트

- [ ] `vercel.json` 파일 커밋 (완료)
- [ ] `.env.production` 환경 변수 설정 (완료)
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 테이블 생성
- [ ] RLS 정책 설정
- [ ] 백엔드 의존성 추가 및 설정
- [ ] 환경 변수 설정 (배포 서버)
- [ ] 백엔드 배포 및 테스트
- [ ] Vercel 환경 변수 설정
- [ ] Vercel 재배포
- [ ] 프로덕션 테스트

---

## 5. 트러블슈팅

### Vercel 404 에러 지속
- `vercel.json` 파일 확인
- `dist` 폴더가 정확히 생성되는지 확인
- Vercel 대시보드에서 빌드 로그 확인

### Supabase 연결 실패
- 인증 키 확인
- VPC 설정 (필요시)
- 데이터베이스 방화벽 설정 확인

### CORS 에러
- 백엔드에서 모든 출처 허용 (필요시):
```java
@CrossOrigin(origins = "*")
```
