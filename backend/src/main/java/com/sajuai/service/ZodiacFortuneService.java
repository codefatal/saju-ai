package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.sajuai.dto.ZodiacFortuneRequest;
import com.sajuai.dto.ZodiacFortuneResponse;
import com.sajuai.exception.GeminiApiException;
import com.sajuai.model.ChineseZodiac;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ZodiacFortuneService {

    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();

    /**
     * 띠별 운세 조회
     */
    public ZodiacFortuneResponse getZodiacFortune(ZodiacFortuneRequest request) {
        ChineseZodiac zodiac = request.getZodiac();
        LocalDate targetDate = request.getTargetDate() != null
            ? LocalDate.parse(request.getTargetDate())
            : LocalDate.now();

        log.info("띠별 운세 조회 시작: {} ({})", zodiac.getKoreanName(), targetDate);

        // AI 프롬프트 생성
        String prompt = buildZodiacFortunePrompt(zodiac, targetDate);

        // Gemini API 호출
        String responseText = geminiApiService.sendAnalysisRequest(prompt);

        // 응답 파싱
        Map<String, Object> fortuneData = parseZodiacFortuneResponse(responseText);

        // Response 생성
        return ZodiacFortuneResponse.builder()
                .zodiac(zodiac)
                .zodiacName(zodiac.getKoreanName())
                .zodiacCharacter(zodiac.getChineseCharacter())
                .date(targetDate)
                .overallFortune((String) fortuneData.get("overallFortune"))
                .loveFortune((String) fortuneData.get("loveFortune"))
                .moneyFortune((String) fortuneData.get("moneyFortune"))
                .workFortune((String) fortuneData.get("workFortune"))
                .healthFortune((String) fortuneData.get("healthFortune"))
                .loveScore(parseScore(fortuneData.get("loveScore")))
                .moneyScore(parseScore(fortuneData.get("moneyScore")))
                .workScore(parseScore(fortuneData.get("workScore")))
                .healthScore(parseScore(fortuneData.get("healthScore")))
                .overallScore(parseScore(fortuneData.get("overallScore")))
                .luckyColor((String) fortuneData.get("luckyColor"))
                .luckyNumber(parseScore(fortuneData.get("luckyNumber")))
                .luckyDirection((String) fortuneData.get("luckyDirection"))
                .caution((String) fortuneData.get("caution"))
                .advice((String) fortuneData.get("advice"))
                .build();
    }

    /**
     * 띠별 운세 프롬프트 생성
     */
    private String buildZodiacFortunePrompt(ChineseZodiac zodiac, LocalDate targetDate) {
        return String.format("""
                당신은 전문 사주명리학자입니다. %s띠(%s) 사람들의 %s 운세를 분석해주세요.

                띠: %s (%s)
                날짜: %s
                요일: %s

                띠의 특성과 오늘의 기운을 고려하여 상세한 운세를 제공해주세요.
                각 운세는 구체적이고 실용적인 조언을 포함해야 합니다.

                다음 형식의 JSON으로 작성해주세요:
                {
                  "overallFortune": "전반적인 오늘의 운세 (150-200자)",
                  "loveFortune": "애정운 (80-100자)",
                  "moneyFortune": "재물운 (80-100자)",
                  "workFortune": "직업운 (80-100자)",
                  "healthFortune": "건강운 (80-100자)",
                  "loveScore": 애정운 점수 (0-100),
                  "moneyScore": 재물운 점수 (0-100),
                  "workScore": 직업운 점수 (0-100),
                  "healthScore": 건강운 점수 (0-100),
                  "overallScore": 종합 운세 점수 (0-100),
                  "luckyColor": "행운의 색상",
                  "luckyNumber": 행운의 숫자 (1-100),
                  "luckyDirection": "행운의 방향 (동/서/남/북)",
                  "caution": "오늘 주의할 점 (60-80자)",
                  "advice": "오늘의 조언 (100-120자)"
                }

                JSON 형식만 출력하고 다른 설명은 포함하지 마세요.
                """,
                zodiac.getKoreanName(),
                zodiac.getChineseCharacter(),
                targetDate,
                zodiac.getKoreanName(),
                zodiac.getChineseCharacter(),
                targetDate,
                targetDate.getDayOfWeek().toString()
        );
    }

    /**
     * Gemini 응답 파싱
     */
    private Map<String, Object> parseZodiacFortuneResponse(String responseText) {
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
            if (result == null || !result.containsKey("overallFortune")) {
                throw new GeminiApiException("응답에 필수 필드가 없습니다");
            }

            return result;

        } catch (JsonSyntaxException e) {
            log.error("JSON 파싱 실패: {}", responseText, e);
            throw new GeminiApiException("AI 응답 파싱 실패", e);
        }
    }

    /**
     * 점수 파싱
     */
    private Integer parseScore(Object obj) {
        if (obj instanceof Double) {
            return ((Double) obj).intValue();
        } else if (obj instanceof Integer) {
            return (Integer) obj;
        }
        return 50; // 기본값
    }
}
