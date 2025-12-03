package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.sajuai.dto.BirthDataRequest;
import com.sajuai.dto.SajuAnalysisResponse;
import com.sajuai.exception.GeminiApiException;
import com.sajuai.model.BirthData;
import com.sajuai.model.SajuResult;
import com.sajuai.repository.BirthDataRepository;
import com.sajuai.repository.SajuResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 사주 분석 비즈니스 로직 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SajuAnalysisService {

    private final BirthDataRepository birthDataRepository;
    private final SajuResultRepository sajuResultRepository;
    private final SajuCalculatorService calculatorService;
    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();

    /**
     * 사주 분석 수행
     *
     * @param request 생년월일 정보
     * @return 사주 분석 결과
     */
    @Transactional
    public SajuAnalysisResponse analyzeSaju(BirthDataRequest request) {
        log.info("사주 분석 시작: {}-{}-{} {}:{}",
                request.getYear(), request.getMonth(), request.getDay(),
                request.getHour(), request.getMinute());

        // 1. BirthData 엔티티 생성 및 저장
        BirthData birthData = BirthData.builder()
                .year(request.getYear())
                .month(request.getMonth())
                .day(request.getDay())
                .hour(request.getHour())
                .minute(request.getMinute())
                .gender(request.getGender())
                .isLunar(request.getIsLunar())
                .build();

        birthData = birthDataRepository.save(birthData);
        log.debug("BirthData 저장 완료: id={}", birthData.getId());

        // 2. 사주팔자 계산
        Map<String, String> pillars = calculatorService.calculateFourPillars(birthData);
        log.debug("사주팔자 계산 완료: {}", pillars);

        // 3. AI 분석 프롬프트 생성
        String prompt = buildPrompt(pillars, birthData);
        log.debug("프롬프트 생성 완료");

        // 4. Gemini API 호출
        String responseText = geminiApiService.sendAnalysisRequest(prompt);
        log.debug("Gemini API 응답 수신");

        // 5. 응답 파싱
        Map<String, Object> analysisResult = parseAnalysisResponse(responseText);
        log.debug("응답 파싱 완료");

        // 6. SajuResult 엔티티 생성 및 저장
        SajuResult sajuResult = SajuResult.builder()
                .birthData(birthData)
                .yearPillar(pillars.get("yearPillar"))
                .monthPillar(pillars.get("monthPillar"))
                .dayPillar(pillars.get("dayPillar"))
                .hourPillar(pillars.get("hourPillar"))
                .personality((String) analysisResult.get("personality"))
                .fortune((String) analysisResult.get("fortune"))
                .career((String) analysisResult.get("career"))
                .relationship((String) analysisResult.get("relationship"))
                .health((String) analysisResult.get("health"))
                .advice((String) analysisResult.get("advice"))
                .luckyColors(gson.toJson(analysisResult.get("luckyColors")))
                .luckyNumbers(gson.toJson(analysisResult.get("luckyNumbers")))
                .build();

        sajuResult = sajuResultRepository.save(sajuResult);
        log.info("사주 분석 완료: id={}", sajuResult.getId());

        // 7. DTO 변환 및 반환
        return convertToResponse(sajuResult);
    }

    /**
     * AI 분석 프롬프트 생성
     */
    private String buildPrompt(Map<String, String> pillars, BirthData birthData) {
        String calendar = birthData.getIsLunar() ? "음력" : "양력";
        String genderStr = birthData.getGender().name().equals("MALE") ? "남성" : "여성";

        return String.format("""
                당신은 전문 사주명리학자입니다. 다음 정보를 바탕으로 상세한 사주 분석을 해주세요.

                생년월일: %s %d년 %d월 %d일 %d시 %d분 (%s)

                사주팔자:
                - 년주: %s
                - 월주: %s
                - 일주: %s
                - 시주: %s

                다음 형식의 JSON으로 분석 결과를 작성해주세요:
                {
                  "personality": "성격 분석 (200-300자)",
                  "fortune": "전반적인 운세 (200-300자)",
                  "career": "직업운 및 재물운 (200-300자)",
                  "relationship": "애정운 및 대인관계 (200-300자)",
                  "health": "건강운 (150-200자)",
                  "advice": "조언 및 개운법 (200-300자)",
                  "luckyColors": ["색상1", "색상2", "색상3"],
                  "luckyNumbers": [숫자1, 숫자2, 숫자3]
                }

                JSON 형식만 출력하고 다른 설명은 포함하지 마세요.
                """,
                calendar, birthData.getYear(), birthData.getMonth(), birthData.getDay(),
                birthData.getHour(), birthData.getMinute(), genderStr,
                pillars.get("yearPillar"),
                pillars.get("monthPillar"),
                pillars.get("dayPillar"),
                pillars.get("hourPillar")
        );
    }

    /**
     * Gemini 응답 파싱
     */
    private Map<String, Object> parseAnalysisResponse(String responseText) {
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
            if (result == null || !result.containsKey("personality") || !result.containsKey("fortune")) {
                throw new GeminiApiException("응답에 필수 필드가 없습니다");
            }

            return result;

        } catch (JsonSyntaxException e) {
            log.error("JSON 파싱 실패: {}", responseText, e);
            throw new GeminiApiException("AI 응답 파싱 실패", e);
        }
    }

    /**
     * 특정 사주 결과 조회
     */
    @Transactional(readOnly = true)
    public SajuAnalysisResponse getSajuById(Long id) {
        SajuResult result = sajuResultRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사주 분석 결과를 찾을 수 없습니다: id=" + id));
        return convertToResponse(result);
    }

    /**
     * 특정 사주 결과 엔티티 조회 (PDF 생성용)
     */
    @Transactional(readOnly = true)
    public SajuResult getSajuResultEntity(Long id) {
        SajuResult result = sajuResultRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사주 분석 결과를 찾을 수 없습니다: id=" + id));

        // Eager loading: BirthData를 Transactional 범위 내에서 강제로 로드
        result.getBirthData().getYear(); // 접근하여 초기화

        return result;
    }

    /**
     * 최근 사주 분석 이력 조회
     */
    @Transactional(readOnly = true)
    public List<SajuAnalysisResponse> getRecentHistory(int limit) {
        List<SajuResult> results = sajuResultRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(0, limit));
        return results.stream()
                .map(this::convertToResponse)
                .toList();
    }

    /**
     * Entity를 DTO로 변환
     */
    private SajuAnalysisResponse convertToResponse(SajuResult result) {
        BirthData birthData = result.getBirthData();

        // JSON 배열 파싱
        Type listType = new TypeToken<List<String>>(){}.getType();
        List<String> luckyColors = gson.fromJson(result.getLuckyColors(), listType);

        Type intListType = new TypeToken<List<Double>>(){}.getType();
        List<Double> luckyNumbersDouble = gson.fromJson(result.getLuckyNumbers(), intListType);
        List<Integer> luckyNumbers = luckyNumbersDouble != null
                ? luckyNumbersDouble.stream().map(Double::intValue).toList()
                : new ArrayList<>();

        return SajuAnalysisResponse.builder()
                .id(result.getId())
                .year(birthData.getYear())
                .month(birthData.getMonth())
                .day(birthData.getDay())
                .hour(birthData.getHour())
                .minute(birthData.getMinute())
                .gender(birthData.getGender())
                .isLunar(birthData.getIsLunar())
                .yearPillar(result.getYearPillar())
                .monthPillar(result.getMonthPillar())
                .dayPillar(result.getDayPillar())
                .hourPillar(result.getHourPillar())
                .personality(result.getPersonality())
                .fortune(result.getFortune())
                .career(result.getCareer())
                .relationship(result.getRelationship())
                .health(result.getHealth())
                .advice(result.getAdvice())
                .luckyColors(luckyColors)
                .luckyNumbers(luckyNumbers)
                .createdAt(result.getCreatedAt())
                .build();
    }
}
