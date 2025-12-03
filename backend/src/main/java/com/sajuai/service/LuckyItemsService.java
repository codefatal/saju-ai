package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.sajuai.dto.DailyFortuneRequest;
import com.sajuai.dto.LuckyItemsResponse;
import com.sajuai.exception.GeminiApiException;
import com.sajuai.model.BirthData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class LuckyItemsService {

    private final SajuCalculatorService calculatorService;
    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();

    /**
     * 오늘의 럭키 아이템 조회
     */
    public LuckyItemsResponse getTodayLuckyItems(DailyFortuneRequest request) {
        log.info("오늘의 럭키 아이템 조회 시작: {}-{}-{}", request.getYear(), request.getMonth(), request.getDay());

        LocalDate today = LocalDate.now();

        // BirthData 객체 생성 (DB 저장 없이)
        BirthData birthData = BirthData.builder()
                .year(request.getYear())
                .month(request.getMonth())
                .day(request.getDay())
                .hour(request.getHour())
                .minute(request.getMinute())
                .gender(request.getGender())
                .isLunar(request.getIsLunar())
                .build();

        // 사주팔자 계산
        Map<String, String> pillars = calculatorService.calculateFourPillars(birthData);

        // AI 프롬프트 생성
        String prompt = buildLuckyItemsPrompt(pillars, birthData, today);

        // Gemini API 호출
        String responseText = geminiApiService.sendAnalysisRequest(prompt);

        // 응답 파싱
        Map<String, Object> luckyData = parseLuckyItemsResponse(responseText);

        // Response 생성
        return LuckyItemsResponse.builder()
                .date(today)
                .luckyColors(parseStringList(luckyData.get("luckyColors")))
                .luckyNumbers(parseIntegerList(luckyData.get("luckyNumbers")))
                .luckyFoods(parseStringList(luckyData.get("luckyFoods")))
                .luckyScent((String) luckyData.get("luckyScent"))
                .luckyItems(parseStringList(luckyData.get("luckyItems")))
                .luckyPlace((String) luckyData.get("luckyPlace"))
                .thingsToAvoid(parseStringList(luckyData.get("thingsToAvoid")))
                .dailyMessage((String) luckyData.get("dailyMessage"))
                .build();
    }

    /**
     * 럭키 아이템 프롬프트 생성
     */
    private String buildLuckyItemsPrompt(Map<String, String> pillars, BirthData birthData, LocalDate targetDate) {
        String calendar = birthData.getIsLunar() ? "음력" : "양력";
        String genderStr = birthData.getGender().name().equals("MALE") ? "남성" : "여성";

        return String.format("""
                당신은 전문 사주명리학자입니다. 다음 사주를 가진 사람의 %s 오늘의 행운 아이템을 추천해주세요.

                생년월일: %s %d년 %d월 %d일 %d시 %d분 (%s)

                사주팔자:
                - 년주: %s
                - 월주: %s
                - 일주: %s
                - 시주: %s

                오늘 날짜: %s

                오행과 사주를 기반으로 오늘 하루 행운을 가져다 줄 아이템들을 추천해주세요.
                실용적이고 일상에서 쉽게 활용할 수 있는 것들로 선택해주세요.

                다음 형식의 JSON으로 작성해주세요:
                {
                  "luckyColors": ["색상1", "색상2", "색상3"],
                  "luckyNumbers": [숫자1, 숫자2, 숫자3],
                  "luckyFoods": ["음식1", "음식2", "음식3"],
                  "luckyScent": "오늘의 행운의 향 (예: 라벤더, 시트러스 등)",
                  "luckyItems": ["물건1", "물건2", "물건3"],
                  "luckyPlace": "오늘 가면 좋을 장소 유형 (예: 공원, 카페, 서점 등)",
                  "thingsToAvoid": ["피해야 할 것1", "피해야 할 것2"],
                  "dailyMessage": "오늘의 긍정적인 한마디 (50자 내외)"
                }

                JSON 형식만 출력하고 다른 설명은 포함하지 마세요.
                """,
                targetDate,
                calendar, birthData.getYear(), birthData.getMonth(), birthData.getDay(),
                birthData.getHour(), birthData.getMinute(), genderStr,
                pillars.get("yearPillar"),
                pillars.get("monthPillar"),
                pillars.get("dayPillar"),
                pillars.get("hourPillar"),
                targetDate
        );
    }

    /**
     * Gemini 응답 파싱
     */
    private Map<String, Object> parseLuckyItemsResponse(String responseText) {
        try {
            // JSON 마크다운 제거
            String jsonText = responseText.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            jsonText = jsonText.trim();

            // JSON 파싱
            Type type = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> result = gson.fromJson(jsonText, type);

            // 필수 필드 검증
            if (result == null || !result.containsKey("luckyColors")) {
                throw new GeminiApiException("응답에 필수 필드가 없습니다");
            }

            return result;

        } catch (JsonSyntaxException e) {
            log.error("JSON 파싱 실패: {}", responseText, e);
            throw new GeminiApiException("AI 응답 파싱 실패", e);
        }
    }

    /**
     * String 리스트 파싱
     */
    @SuppressWarnings("unchecked")
    private List<String> parseStringList(Object obj) {
        if (obj instanceof List) {
            return (List<String>) obj;
        }
        return List.of();
    }

    /**
     * Integer 리스트 파싱
     */
    @SuppressWarnings("unchecked")
    private List<Integer> parseIntegerList(Object obj) {
        if (obj instanceof List) {
            List<?> list = (List<?>) obj;
            return list.stream()
                    .map(item -> {
                        if (item instanceof Double) {
                            return ((Double) item).intValue();
                        } else if (item instanceof Integer) {
                            return (Integer) item;
                        }
                        return 0;
                    })
                    .toList();
        }
        return List.of();
    }
}
