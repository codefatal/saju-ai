package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sajuai.dto.TojeongRequest;
import com.sajuai.dto.TojeongResponse;
import com.sajuai.model.BirthData;
import com.sajuai.model.Gender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TojeongService {

    private final GeminiApiService geminiApiService;
    private final SajuCalculatorService sajuCalculatorService;
    private final Gson gson = new Gson();

    private static final String[] MONTH_NAMES = {
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
    };

    public TojeongResponse getTojeongFortune(TojeongRequest request) {
        try {
            // 사주 계산
            BirthData birthData = BirthData.builder()
                    .year(request.getBirthYear())
                    .month(request.getBirthMonth())
                    .day(request.getBirthDay())
                    .hour(12)
                    .minute(0)
                    .isLunar(false)
                    .gender(request.getGender() != null ? Gender.valueOf(request.getGender()) : Gender.MALE)
                    .build();

            var fourPillars = sajuCalculatorService.calculateFourPillars(birthData);
            String sajuInfo = String.format("년주: %s, 월주: %s, 일주: %s",
                    fourPillars.get("yearPillar"),
                    fourPillars.get("monthPillar"),
                    fourPillars.get("dayPillar"));

            // Gemini API에 토정비결 요청
            String prompt = buildTojeongPrompt(request, sajuInfo);
            String responseText = geminiApiService.sendAnalysisRequest(prompt);

            // JSON 응답 파싱
            JsonObject jsonResponse = parseJsonResponse(responseText);

            // 월별 운세 리스트 생성
            List<TojeongResponse.MonthlyFortune> monthlyFortunes = new ArrayList<>();
            JsonArray monthsArray = jsonResponse.getAsJsonArray("monthlyFortunes");

            for (int i = 0; i < monthsArray.size(); i++) {
                JsonObject monthJson = monthsArray.get(i).getAsJsonObject();

                List<String> goodThings = new ArrayList<>();
                JsonArray goodArray = monthJson.getAsJsonArray("goodThings");
                for (int j = 0; j < goodArray.size(); j++) {
                    goodThings.add(goodArray.get(j).getAsString());
                }

                List<String> warningThings = new ArrayList<>();
                JsonArray warningArray = monthJson.getAsJsonArray("warningThings");
                for (int j = 0; j < warningArray.size(); j++) {
                    warningThings.add(warningArray.get(j).getAsString());
                }

                monthlyFortunes.add(TojeongResponse.MonthlyFortune.builder()
                        .month(monthJson.get("month").getAsInt())
                        .monthName(MONTH_NAMES[monthJson.get("month").getAsInt() - 1])
                        .score(monthJson.get("score").getAsInt())
                        .rating(monthJson.get("rating").getAsString())
                        .overallFortune(monthJson.get("overallFortune").getAsString())
                        .luckyStar(monthJson.get("luckyStar").getAsString())
                        .advice(monthJson.get("advice").getAsString())
                        .goodThings(goodThings)
                        .warningThings(warningThings)
                        .build());
            }

            return TojeongResponse.builder()
                    .year(request.getYear())
                    .birthYear(request.getBirthYear())
                    .birthMonth(request.getBirthMonth())
                    .birthDay(request.getBirthDay())
                    .monthlyFortunes(monthlyFortunes)
                    .yearlyOverview(jsonResponse.get("yearlyOverview").getAsString())
                    .yearlyScore(jsonResponse.get("yearlyScore").getAsInt())
                    .bestMonth(jsonResponse.get("bestMonth").getAsString())
                    .worstMonth(jsonResponse.get("worstMonth").getAsString())
                    .yearlyAdvice(jsonResponse.get("yearlyAdvice").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Tojeong fortune calculation failed: {}", e.getMessage(), e);
            throw new RuntimeException("토정비결 분석에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildTojeongPrompt(TojeongRequest request, String sajuInfo) {
        return String.format("""
                당신은 전통 토정비결 전문가입니다. 다음 정보로 %d년 연운을 분석해주세요.

                [기본 정보]
                - 생년월일: %d년 %d월 %d일
                - 사주: %s
                - 분석 연도: %d년

                전통 토정비결에 기반하여 12개월 운세를 JSON 형식으로 제공해주세요:

                {
                  "monthlyFortunes": [
                    {
                      "month": 1,
                      "score": 85,
                      "rating": "EXCELLENT",
                      "overallFortune": "이 달의 전반적인 운세 (2-3문장)",
                      "luckyStar": "길성 또는 흉성 이름",
                      "advice": "이 달의 조언 (1-2문장)",
                      "goodThings": ["좋은 일 1", "좋은 일 2"],
                      "warningThings": ["주의할 일 1", "주의할 일 2"]
                    },
                    ... (12개월 모두)
                  ],
                  "yearlyOverview": "연간 종합 운세 (3-4문장)",
                  "yearlyScore": 75,
                  "bestMonth": "5월",
                  "worstMonth": "11월",
                  "yearlyAdvice": "연간 조언 (3-4문장)"
                }

                토정비결 분석 시 고려사항:
                - 12개월 각각의 운세를 상세히 분석
                - 점수는 0-100, rating은 EXCELLENT(80+), GOOD(60+), FAIR(40+), POOR(40 미만)
                - 전통 토정비결의 길흉화복 원리 적용
                - 실용적이고 구체적인 조언 제공
                - 각 달의 특성과 주의사항 명시
                """,
                request.getYear(),
                request.getBirthYear(), request.getBirthMonth(), request.getBirthDay(),
                sajuInfo,
                request.getYear()
        );
    }

    private JsonObject parseJsonResponse(String responseText) {
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
