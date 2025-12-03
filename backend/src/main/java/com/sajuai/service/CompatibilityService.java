package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.sajuai.dto.CompatibilityRequest;
import com.sajuai.dto.CompatibilityResponse;
import com.sajuai.model.BirthData;
import com.sajuai.model.Gender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompatibilityService {

    private final GeminiApiService geminiApiService;
    private final SajuCalculatorService sajuCalculatorService;
    private final Gson gson = new Gson();

    public CompatibilityResponse analyzeCompatibility(CompatibilityRequest request) {
        try {
            // 두 사람의 사주 계산
            BirthData person1BirthData = createBirthData(
                    request.getPerson1Year(), request.getPerson1Month(), request.getPerson1Day(),
                    request.getPerson1Hour(), request.getPerson1Minute(),
                    request.getPerson1Gender(), request.getPerson1IsLunar()
            );

            BirthData person2BirthData = createBirthData(
                    request.getPerson2Year(), request.getPerson2Month(), request.getPerson2Day(),
                    request.getPerson2Hour(), request.getPerson2Minute(),
                    request.getPerson2Gender(), request.getPerson2IsLunar()
            );

            Map<String, String> person1Pillars = sajuCalculatorService.calculateFourPillars(person1BirthData);
            Map<String, String> person2Pillars = sajuCalculatorService.calculateFourPillars(person2BirthData);

            String person1Saju = String.format("%s %s %s %s",
                    person1Pillars.get("yearPillar"),
                    person1Pillars.get("monthPillar"),
                    person1Pillars.get("dayPillar"),
                    person1Pillars.get("hourPillar"));

            String person2Saju = String.format("%s %s %s %s",
                    person2Pillars.get("yearPillar"),
                    person2Pillars.get("monthPillar"),
                    person2Pillars.get("dayPillar"),
                    person2Pillars.get("hourPillar"));

            // Gemini API에 궁합 분석 요청
            String prompt = buildCompatibilityPrompt(request, person1Saju, person2Saju);
            String responseText = geminiApiService.sendAnalysisRequest(prompt);

            // JSON 응답 파싱
            JsonObject jsonResponse = parseJsonResponse(responseText);

            // 이름 설정 (제공되지 않으면 기본값)
            String person1Name = request.getPerson1Name() != null && !request.getPerson1Name().isEmpty()
                    ? request.getPerson1Name() : "첫 번째 사람";
            String person2Name = request.getPerson2Name() != null && !request.getPerson2Name().isEmpty()
                    ? request.getPerson2Name() : "두 번째 사람";

            return CompatibilityResponse.builder()
                    .person1Name(person1Name)
                    .person1Saju(person1Saju)
                    .person2Name(person2Name)
                    .person2Saju(person2Saju)
                    .overallScore(jsonResponse.get("overallScore").getAsInt())
                    .loveScore(jsonResponse.get("loveScore").getAsInt())
                    .marriageScore(jsonResponse.get("marriageScore").getAsInt())
                    .businessScore(jsonResponse.get("businessScore").getAsInt())
                    .friendshipScore(jsonResponse.get("friendshipScore").getAsInt())
                    .overallCompatibility(jsonResponse.get("overallCompatibility").getAsString())
                    .loveCompatibility(jsonResponse.get("loveCompatibility").getAsString())
                    .marriageCompatibility(jsonResponse.get("marriageCompatibility").getAsString())
                    .businessCompatibility(jsonResponse.get("businessCompatibility").getAsString())
                    .friendshipCompatibility(jsonResponse.get("friendshipCompatibility").getAsString())
                    .strengths(jsonResponse.get("strengths").getAsString())
                    .weaknesses(jsonResponse.get("weaknesses").getAsString())
                    .advice(jsonResponse.get("advice").getAsString())
                    .compatibilityGrade(jsonResponse.get("compatibilityGrade").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Compatibility analysis failed: {}", e.getMessage(), e);
            throw new RuntimeException("궁합 분석에 실패했습니다: " + e.getMessage());
        }
    }

    private BirthData createBirthData(int year, int month, int day, int hour, int minute, String gender, boolean isLunar) {
        return BirthData.builder()
                .year(year)
                .month(month)
                .day(day)
                .hour(hour)
                .minute(minute)
                .gender(Gender.valueOf(gender))
                .isLunar(isLunar)
                .build();
    }

    private String buildCompatibilityPrompt(CompatibilityRequest request, String person1Saju, String person2Saju) {
        return String.format("""
                다음 두 사람의 사주팔자를 바탕으로 궁합을 분석해주세요.

                [첫 번째 사람]
                - 이름: %s
                - 생년월일시: %d년 %d월 %d일 %d시 %d분 (%s, %s)
                - 사주팔자: %s

                [두 번째 사람]
                - 이름: %s
                - 생년월일시: %d년 %d월 %d일 %d시 %d분 (%s, %s)
                - 사주팔자: %s

                다음 형식의 JSON으로 응답해주세요:
                {
                  "overallScore": 0~100 사이의 정수 (전체 궁합 점수),
                  "loveScore": 0~100 사이의 정수 (애정 궁합 점수),
                  "marriageScore": 0~100 사이의 정수 (결혼 궁합 점수),
                  "businessScore": 0~100 사이의 정수 (사업 궁합 점수),
                  "friendshipScore": 0~100 사이의 정수 (우정 궁합 점수),
                  "overallCompatibility": "전반적인 궁합 분석 (3-4문장)",
                  "loveCompatibility": "애정 궁합 분석 (2-3문장)",
                  "marriageCompatibility": "결혼 궁합 분석 (2-3문장)",
                  "businessCompatibility": "사업/동업 궁합 분석 (2-3문장)",
                  "friendshipCompatibility": "우정/친구 궁합 분석 (2-3문장)",
                  "strengths": "두 사람의 강점 (2-3가지를 나열)",
                  "weaknesses": "주의해야 할 약점 (2-3가지를 나열)",
                  "advice": "두 사람을 위한 조언 (3-4문장)",
                  "compatibilityGrade": "최상/상/중/하 중 하나"
                }

                궁합 분석 시 고려사항:
                - 사주의 오행 조화
                - 천간지지의 상생상극 관계
                - 성별에 따른 음양 조화
                - 나이 차이와 세대 조화
                - 각 관계별(애정, 결혼, 사업, 우정) 특성 반영
                """,
                request.getPerson1Name() != null ? request.getPerson1Name() : "첫 번째 사람",
                request.getPerson1Year(), request.getPerson1Month(), request.getPerson1Day(),
                request.getPerson1Hour(), request.getPerson1Minute(),
                request.getPerson1Gender().equals("MALE") ? "남성" : "여성",
                request.getPerson1IsLunar() ? "음력" : "양력",
                person1Saju,
                request.getPerson2Name() != null ? request.getPerson2Name() : "두 번째 사람",
                request.getPerson2Year(), request.getPerson2Month(), request.getPerson2Day(),
                request.getPerson2Hour(), request.getPerson2Minute(),
                request.getPerson2Gender().equals("MALE") ? "남성" : "여성",
                request.getPerson2IsLunar() ? "음력" : "양력",
                person2Saju
        );
    }

    private JsonObject parseJsonResponse(String responseText) {
        // JSON 블록 추출 (```json ... ``` 형식)
        String jsonText = responseText;
        if (responseText.contains("```json")) {
            int startIndex = responseText.indexOf("```json") + 7;
            int endIndex = responseText.lastIndexOf("```");
            if (endIndex > startIndex) {
                jsonText = responseText.substring(startIndex, endIndex).trim();
            }
        } else if (responseText.contains("```")) {
            int startIndex = responseText.indexOf("```") + 3;
            int endIndex = responseText.lastIndexOf("```");
            if (endIndex > startIndex) {
                jsonText = responseText.substring(startIndex, endIndex).trim();
            }
        }

        return gson.fromJson(jsonText, JsonObject.class);
    }
}
