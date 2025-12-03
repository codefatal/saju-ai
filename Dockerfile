FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# 소스코드 복사
COPY . .

# Spring Boot JAR 빌드
RUN cd backend && gradle clean bootJar -x test

# 실행 이미지
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 빌드 이미지에서 JAR 파일 복사
COPY --from=builder /app/backend/build/libs/*.jar app.jar

# 포트 설정
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.profiles.active=prod --server.port=${PORT:-8080}"]
