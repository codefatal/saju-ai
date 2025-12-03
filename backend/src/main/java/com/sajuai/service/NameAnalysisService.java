package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.sajuai.dto.NameAnalysisRequest;
import com.sajuai.dto.NameAnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NameAnalysisService {

    private final GeminiApiService geminiApiService;
    private final SajuCalculatorService sajuCalculatorService;
    private final Gson gson = new Gson();

    // 획수별 오행 매핑
    private static final Map<Integer, String> STROKE_TO_ELEMENT = new HashMap<>();
    static {
        STROKE_TO_ELEMENT.put(1, "목"); STROKE_TO_ELEMENT.put(2, "목");
        STROKE_TO_ELEMENT.put(3, "화"); STROKE_TO_ELEMENT.put(4, "화");
        STROKE_TO_ELEMENT.put(5, "토"); STROKE_TO_ELEMENT.put(6, "토");
        STROKE_TO_ELEMENT.put(7, "금"); STROKE_TO_ELEMENT.put(8, "금");
        STROKE_TO_ELEMENT.put(9, "수"); STROKE_TO_ELEMENT.put(10, "수");
    }

    public NameAnalysisService(GeminiApiService geminiApiService, SajuCalculatorService sajuCalculatorService) {
        this.geminiApiService = geminiApiService;
        this.sajuCalculatorService = sajuCalculatorService;
    }

    public NameAnalysisResponse analyzeName(NameAnalysisRequest request) {
        log.info("이름 분석 요청: {}", request.getName());

        // 1. 사주 정보 계산 (생년월일 제공 시)
        String sajuInfo = null;
        if (request.getBirthYear() != null && request.getBirthMonth() != null && request.getBirthDay() != null) {
            sajuInfo = calculateSajuForName(request);
        }

        // 2. Gemini API로 이름 분석 요청
        String prompt = buildPrompt(request, sajuInfo);
        String responseText = geminiApiService.sendAnalysisRequest(prompt);

        // 3. JSON 응답 파싱
        JsonObject jsonResponse = parseJsonResponse(responseText);

        // 4. 응답 DTO 구성
        return buildResponse(request, jsonResponse);
    }

    private String calculateSajuForName(NameAnalysisRequest request) {
        try {
            com.sajuai.model.BirthData birthData = com.sajuai.model.BirthData.builder()
                    .year(request.getBirthYear())
                    .month(request.getBirthMonth())
                    .day(request.getBirthDay())
                    .hour(12)
                    .minute(0)
                    .gender(request.getGender() != null ? com.sajuai.model.Gender.valueOf(request.getGender()) : com.sajuai.model.Gender.MALE)
                    .isLunar(false)
                    .build();

            var fourPillars = sajuCalculatorService.calculateFourPillars(birthData);
            return String.format("년주: %s, 월주: %s, 일주: %s, 시주: %s",
                    fourPillars.get("yearPillar"),
                    fourPillars.get("monthPillar"),
                    fourPillars.get("dayPillar"),
                    fourPillars.get("hourPillar"));
        } catch (Exception e) {
            log.warn("사주 계산 실패: {}", e.getMessage());
            return null;
        }
    }

    private String buildPrompt(NameAnalysisRequest request, String sajuInfo) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("당신은 전문 작명가이자 성명학 전문가입니다. 다음 이름을 전통 성명학과 한자 의미를 바탕으로 분석해주세요.\n\n");

        prompt.append("**이름**: ").append(request.getName()).append("\n");
        prompt.append("**목적**: ").append(request.getPurpose() != null ?
                (request.getPurpose().equals("CURRENT") ? "현재 이름 분석" : "작명/개명 평가") : "현재 이름 분석").append("\n");

        if (sajuInfo != null) {
            prompt.append("**사주 정보**: ").append(sajuInfo).append("\n");
        }

        prompt.append("\n다음 형식의 JSON으로 응답해주세요:\n\n");
        prompt.append("```json\n");
        prompt.append("{\n");
        prompt.append("  \"characters\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"character\": \"한글/한자\",\n");
        prompt.append("      \"meaning\": \"한자의 의미\",\n");
        prompt.append("      \"strokes\": 획수(정수),\n");
        prompt.append("      \"pronunciation\": \"발음\",\n");
        prompt.append("      \"element\": \"오행(목/화/토/금/수)\"\n");
        prompt.append("    }\n");
        prompt.append("  ],\n");
        prompt.append("  \"totalStrokes\": 총획수(정수),\n");
        prompt.append("  \"heavenStrokes\": 천격(정수),\n");
        prompt.append("  \"earthStrokes\": 지격(정수),\n");
        prompt.append("  \"personalityStrokes\": 인격(정수),\n");
        prompt.append("  \"outerStrokes\": 외격(정수),\n");
        prompt.append("  \"totalStrokesForte\": 총격(정수),\n");
        prompt.append("  \"heavenElement\": \"천격 오행\",\n");
        prompt.append("  \"earthElement\": \"지격 오행\",\n");
        prompt.append("  \"personalityElement\": \"인격 오행\",\n");
        prompt.append("  \"elementBalance\": \"오행 균형 평가\",\n");
        prompt.append("  \"overallScore\": 종합점수(0-100),\n");
        prompt.append("  \"overallRating\": \"EXCELLENT/GOOD/FAIR/POOR\",\n");
        prompt.append("  \"nameMeaning\": \"이름의 전체적인 의미\",\n");
        prompt.append("  \"personalityAnalysis\": \"이름이 나타내는 성격 특성\",\n");
        prompt.append("  \"fortuneAnalysis\": \"이름이 암시하는 운세\",\n");
        prompt.append("  \"compatibility\": \"사주와의 궁합 분석 (사주 정보 있을 경우)\",\n");
        prompt.append("  \"strengths\": [\"강점1\", \"강점2\", \"강점3\"],\n");
        prompt.append("  \"weaknesses\": [\"약점1\", \"약점2\"],\n");
        prompt.append("  \"advice\": \"종합 조언\",\n");
        prompt.append("  \"luckyColors\": [\"색상1\", \"색상2\"],\n");
        prompt.append("  \"luckyNumbers\": [숫자1, 숫자2, 숫자3]\n");
        prompt.append("}\n");
        prompt.append("```\n\n");

        prompt.append("**분석 가이드라인**:\n");
        prompt.append("1. 각 글자의 한자를 추정하고 획수를 정확히 계산하세요\n");
        prompt.append("2. 천격, 지격, 인격, 외격, 총격을 전통 성명학 공식에 따라 계산하세요\n");
        prompt.append("3. 획수별 오행을 적용하여 오행 균형을 평가하세요\n");
        prompt.append("4. 이름의 음양, 발음, 의미를 종합적으로 분석하세요\n");
        prompt.append("5. 사주 정보가 있다면 사주와의 조화를 고려하세요\n");
        prompt.append("6. 모든 설명은 한글로 작성하세요\n");

        return prompt.toString();
    }

    private JsonObject parseJsonResponse(String responseText) {
        try {
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
        } catch (Exception e) {
            log.error("JSON 파싱 실패: {}", e.getMessage());
            throw new RuntimeException("이름 분석 결과 파싱에 실패했습니다: " + e.getMessage());
        }
    }

    private NameAnalysisResponse buildResponse(NameAnalysisRequest request, JsonObject json) {
        // Characters 파싱
        List<NameAnalysisResponse.CharacterAnalysis> characters = new ArrayList<>();
        if (json.has("characters") && json.get("characters").isJsonArray()) {
            JsonArray charArray = json.getAsJsonArray("characters");
            for (JsonElement elem : charArray) {
                JsonObject charObj = elem.getAsJsonObject();
                characters.add(NameAnalysisResponse.CharacterAnalysis.builder()
                        .character(getStringValue(charObj, "character"))
                        .meaning(getStringValue(charObj, "meaning"))
                        .strokes(getIntValue(charObj, "strokes"))
                        .pronunciation(getStringValue(charObj, "pronunciation"))
                        .element(getStringValue(charObj, "element"))
                        .build());
            }
        }

        // Strengths 파싱
        List<String> strengths = new ArrayList<>();
        if (json.has("strengths") && json.get("strengths").isJsonArray()) {
            json.getAsJsonArray("strengths").forEach(elem -> strengths.add(elem.getAsString()));
        }

        // Weaknesses 파싱
        List<String> weaknesses = new ArrayList<>();
        if (json.has("weaknesses") && json.get("weaknesses").isJsonArray()) {
            json.getAsJsonArray("weaknesses").forEach(elem -> weaknesses.add(elem.getAsString()));
        }

        // Lucky Colors 파싱
        List<String> luckyColors = new ArrayList<>();
        if (json.has("luckyColors") && json.get("luckyColors").isJsonArray()) {
            json.getAsJsonArray("luckyColors").forEach(elem -> luckyColors.add(elem.getAsString()));
        }

        // Lucky Numbers 파싱
        List<String> luckyNumbers = new ArrayList<>();
        if (json.has("luckyNumbers") && json.get("luckyNumbers").isJsonArray()) {
            json.getAsJsonArray("luckyNumbers").forEach(elem -> luckyNumbers.add(String.valueOf(elem.getAsInt())));
        }

        return NameAnalysisResponse.builder()
                .name(request.getName())
                .purpose(request.getPurpose())
                .characters(characters)
                .totalStrokes(getIntValue(json, "totalStrokes"))
                .heavenStrokes(getIntValue(json, "heavenStrokes"))
                .earthStrokes(getIntValue(json, "earthStrokes"))
                .personalityStrokes(getIntValue(json, "personalityStrokes"))
                .outerStrokes(getIntValue(json, "outerStrokes"))
                .totalStrokesForte(getIntValue(json, "totalStrokesForte"))
                .heavenElement(getStringValue(json, "heavenElement"))
                .earthElement(getStringValue(json, "earthElement"))
                .personalityElement(getStringValue(json, "personalityElement"))
                .elementBalance(getStringValue(json, "elementBalance"))
                .overallScore(getIntValue(json, "overallScore"))
                .overallRating(getStringValue(json, "overallRating"))
                .nameMeaning(getStringValue(json, "nameMeaning"))
                .personalityAnalysis(getStringValue(json, "personalityAnalysis"))
                .fortuneAnalysis(getStringValue(json, "fortuneAnalysis"))
                .compatibility(getStringValue(json, "compatibility"))
                .strengths(strengths)
                .weaknesses(weaknesses)
                .advice(getStringValue(json, "advice"))
                .luckyColors(luckyColors)
                .luckyNumbers(luckyNumbers)
                .build();
    }

    private String getStringValue(JsonObject json, String key) {
        if (json.has(key) && !json.get(key).isJsonNull()) {
            return json.get(key).getAsString();
        }
        return "";
    }

    private Integer getIntValue(JsonObject json, String key) {
        if (json.has(key) && !json.get(key).isJsonNull()) {
            return json.get(key).getAsInt();
        }
        return 0;
    }
}
