package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sajuai.dto.DreamInterpretationRequest;
import com.sajuai.dto.DreamInterpretationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DreamInterpretationService {

    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();

    public DreamInterpretationResponse interpretDream(DreamInterpretationRequest request) {
        try {
            // Gemini API에 꿈 해몽 요청
            String prompt = buildDreamPrompt(request);
            String responseText = geminiApiService.sendAnalysisRequest(prompt);

            // JSON 응답 파싱
            JsonObject jsonResponse = parseJsonResponse(responseText);

            // 상징 리스트 생성
            List<DreamInterpretationResponse.DreamSymbol> symbols = new ArrayList<>();
            JsonArray symbolsArray = jsonResponse.getAsJsonArray("symbols");
            for (int i = 0; i < symbolsArray.size(); i++) {
                JsonObject symbolJson = symbolsArray.get(i).getAsJsonObject();
                symbols.add(DreamInterpretationResponse.DreamSymbol.builder()
                        .symbol(symbolJson.get("symbol").getAsString())
                        .meaning(symbolJson.get("meaning").getAsString())
                        .significance(symbolJson.get("significance").getAsString())
                        .build());
            }

            return DreamInterpretationResponse.builder()
                    .dreamContent(request.getDreamContent())
                    .category(request.getCategory())
                    .name(request.getName())
                    .overallMeaning(jsonResponse.get("overallMeaning").getAsString())
                    .psychologicalMeaning(jsonResponse.get("psychologicalMeaning").getAsString())
                    .traditionalMeaning(jsonResponse.get("traditionalMeaning").getAsString())
                    .futurePrediction(jsonResponse.get("futurePrediction").getAsString())
                    .symbols(symbols)
                    .luckyNumber(jsonResponse.get("luckyNumber").getAsString())
                    .advice(jsonResponse.get("advice").getAsString())
                    .warning(jsonResponse.get("warning").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Dream interpretation failed: {}", e.getMessage(), e);
            throw new RuntimeException("꿈 해몽에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildDreamPrompt(DreamInterpretationRequest request) {
        String categoryText = getCategoryText(request.getCategory());
        String moodText = request.getMood() != null ? request.getMood() : "알 수 없음";

        return String.format("""
                당신은 전문 꿈 해몽가입니다. 다음 꿈을 해석해주세요.

                [꿈꾼 사람]
                - 이름: %s
                - 꿈 카테고리: %s
                - 꿈의 분위기: %s

                [꿈 내용]
                %s

                다음 형식의 JSON으로 응답해주세요:
                {
                  "overallMeaning": "꿈의 전체적인 의미와 핵심 메시지 (3-4문장)",
                  "psychologicalMeaning": "융, 프로이트 등 심리학적 관점의 해석 (3-4문장)",
                  "traditionalMeaning": "동양/한국 전통 꿈해몽 관점의 해석 (3-4문장)",
                  "futurePrediction": "꿈이 암시하는 미래나 앞으로의 상황 (2-3문장)",
                  "symbols": [
                    {
                      "symbol": "꿈 속 주요 상징물 1",
                      "meaning": "이 상징의 의미 (2-3문장)",
                      "significance": "HIGH"
                    },
                    {
                      "symbol": "꿈 속 주요 상징물 2",
                      "meaning": "이 상징의 의미 (2-3문장)",
                      "significance": "MEDIUM"
                    },
                    {
                      "symbol": "꿈 속 주요 상징물 3",
                      "meaning": "이 상징의 의미 (2-3문장)",
                      "significance": "LOW"
                    }
                  ],
                  "luckyNumber": "이 꿈과 관련된 행운의 번호 (1-3개, 쉼표로 구분)",
                  "advice": "꿈을 바탕으로 한 조언 (3-4문장)",
                  "warning": "주의해야 할 점이나 경고 (2-3문장)"
                }

                꿈 해몽 시 고려사항:
                - 꿈의 카테고리(%s)와 분위기(%s)를 고려
                - 한국/동양의 전통적 꿈해몽과 현대 심리학적 해석을 모두 제공
                - 꿈 속 주요 상징물을 3개 이상 추출하여 분석
                - 긍정적이면서도 현실적인 해석 제공
                - 꿈의 맥락과 상징들 간의 연관성 설명
                """,
                request.getName() != null ? request.getName() : "꿈꾼 이",
                categoryText,
                moodText,
                request.getDreamContent(),
                categoryText,
                moodText
        );
    }

    private String getCategoryText(String category) {
        if (category == null) return "기타";
        return switch (category) {
            case "PERSON" -> "사람";
            case "ANIMAL" -> "동물";
            case "NATURE" -> "자연";
            case "OBJECT" -> "사물";
            case "ACTION" -> "행동";
            case "EMOTION" -> "감정";
            default -> "기타";
        };
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
