#!/bin/bash
set -e

cd /app

echo "Building Spring Boot application..."
bash backend/gradlew -p backend clean bootJar -x test

echo "Starting application..."
java -jar backend/build/libs/*.jar --spring.profiles.active=prod
