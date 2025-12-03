#!/bin/bash
set -e

echo "Building Spring Boot application..."
cd backend
./gradlew clean bootJar -x test

echo "Starting application..."
java -jar build/libs/*.jar --spring.profiles.active=prod
