package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sajuai.dto.TarotReadingRequest;
import com.sajuai.dto.TarotReadingResponse;
import com.sajuai.model.TarotCardType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class TarotService {

    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();
    private final Random random = new Random();

    public TarotReadingResponse getTarotReading(TarotReadingRequest request) {
        try {
            // 랜덤하게 3장의 카드 선택 (과거, 현재, 미래)
            List<TarotCardType> allCards = List.of(TarotCardType.values());
            List<TarotCardType> shuffledCards = new ArrayList<>(allCards);
            Collections.shuffle(shuffledCards, random);

            TarotCardType pastCard = shuffledCards.get(0);
            TarotCardType presentCard = shuffledCards.get(1);
            TarotCardType futureCard = shuffledCards.get(2);

            // 각 카드의 정방향/역방향 결정
            boolean isPastReversed = random.nextBoolean();
            boolean isPresentReversed = random.nextBoolean();
            boolean isFutureReversed = random.nextBoolean();

            // Gemini API에 타로 리딩 요청
            String prompt = buildTarotPrompt(request, pastCard, presentCard, futureCard,
                    isPastReversed, isPresentReversed, isFutureReversed);
            String responseText = geminiApiService.sendAnalysisRequest(prompt);

            // JSON 응답 파싱
            JsonObject jsonResponse = parseJsonResponse(responseText);

            // 카드 리스트 생성
            List<TarotReadingResponse.TarotCard> cards = new ArrayList<>();

            JsonArray cardsArray = jsonResponse.getAsJsonArray("cards");
            for (int i = 0; i < cardsArray.size(); i++) {
                JsonObject cardJson = cardsArray.get(i).getAsJsonObject();
                cards.add(TarotReadingResponse.TarotCard.builder()
                        .name(cardJson.get("name").getAsString())
                        .nameKorean(cardJson.get("nameKorean").getAsString())
                        .position(cardJson.get("position").getAsString())
                        .isReversed(cardJson.get("isReversed").getAsBoolean())
                        .meaning(cardJson.get("meaning").getAsString())
                        .interpretation(cardJson.get("interpretation").getAsString())
                        .keyword(cardJson.get("keyword").getAsString())
                        .build());
            }

            return TarotReadingResponse.builder()
                    .question(request.getQuestion())
                    .category(request.getCategory())
                    .name(request.getName())
                    .cards(cards)
                    .overallReading(jsonResponse.get("overallReading").getAsString())
                    .advice(jsonResponse.get("advice").getAsString())
                    .warning(jsonResponse.get("warning").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Tarot reading failed: {}", e.getMessage(), e);
            throw new RuntimeException("타로 리딩에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildTarotPrompt(TarotReadingRequest request,
                                     TarotCardType pastCard,
                                     TarotCardType presentCard,
                                     TarotCardType futureCard,
                                     boolean isPastReversed,
                                     boolean isPresentReversed,
                                     boolean isFutureReversed) {
        String categoryText = getCategoryText(request.getCategory());

        return String.format("""
                당신은 전문 타로 리더입니다. 다음 질문에 대해 3장의 카드로 과거-현재-미래를 읽어주세요.

                [질문자 정보]
                - 이름: %s
                - 질문 카테고리: %s
                - 질문: %s

                [뽑힌 카드]
                1. 과거 (PAST): %s (%s) - %s
                2. 현재 (PRESENT): %s (%s) - %s
                3. 미래 (FUTURE): %s (%s) - %s

                다음 형식의 JSON으로 응답해주세요:
                {
                  "cards": [
                    {
                      "name": "%s",
                      "nameKorean": "%s",
                      "position": "PAST",
                      "isReversed": %s,
                      "meaning": "이 카드의 기본 의미 (2-3문장)",
                      "interpretation": "과거 상황에 대한 해석 (3-4문장)",
                      "keyword": "핵심 키워드 3개 (쉼표로 구분)"
                    },
                    {
                      "name": "%s",
                      "nameKorean": "%s",
                      "position": "PRESENT",
                      "isReversed": %s,
                      "meaning": "이 카드의 기본 의미 (2-3문장)",
                      "interpretation": "현재 상황에 대한 해석 (3-4문장)",
                      "keyword": "핵심 키워드 3개 (쉼표로 구분)"
                    },
                    {
                      "name": "%s",
                      "nameKorean": "%s",
                      "position": "FUTURE",
                      "isReversed": %s,
                      "meaning": "이 카드의 기본 의미 (2-3문장)",
                      "interpretation": "미래 전망에 대한 해석 (3-4문장)",
                      "keyword": "핵심 키워드 3개 (쉼표로 구분)"
                    }
                  ],
                  "overallReading": "3장의 카드를 종합한 전체 해석 (4-5문장)",
                  "advice": "질문자에게 주는 조언 (3-4문장)",
                  "warning": "주의해야 할 점 (2-3문장)"
                }

                타로 리딩 시 고려사항:
                - 정방향/역방향에 따른 의미 차이 반영
                - 질문 카테고리(%s)에 맞는 해석 제공
                - 과거-현재-미래의 흐름과 연결성 설명
                - 긍정적이면서도 현실적인 조언
                - 카드 간의 상호작용과 시너지 고려
                """,
                request.getName() != null ? request.getName() : "질문자",
                categoryText,
                request.getQuestion(),
                pastCard.getKoreanName(),
                isPastReversed ? "역방향" : "정방향",
                pastCard.getBasicMeaning(),
                presentCard.getKoreanName(),
                isPresentReversed ? "역방향" : "정방향",
                presentCard.getBasicMeaning(),
                futureCard.getKoreanName(),
                isFutureReversed ? "역방향" : "정방향",
                futureCard.getBasicMeaning(),
                pastCard.getEnglishName(),
                pastCard.getKoreanName(),
                isPastReversed,
                presentCard.getEnglishName(),
                presentCard.getKoreanName(),
                isPresentReversed,
                futureCard.getEnglishName(),
                futureCard.getKoreanName(),
                isFutureReversed,
                categoryText
        );
    }

    private String getCategoryText(String category) {
        if (category == null) return "종합운";
        return switch (category) {
            case "LOVE" -> "연애운";
            case "CAREER" -> "직업운";
            case "MONEY" -> "재물운";
            case "HEALTH" -> "건강운";
            default -> "종합운";
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
