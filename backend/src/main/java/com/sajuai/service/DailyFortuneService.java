package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import com.sajuai.dto.DailyFortuneRequest;
import com.sajuai.dto.DailyFortuneResponse;
import com.sajuai.exception.GeminiApiException;
import com.sajuai.model.BirthData;
import com.sajuai.model.DailyFortune;
import com.sajuai.repository.BirthDataRepository;
import com.sajuai.repository.DailyFortuneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class DailyFortuneService {

    private final BirthDataRepository birthDataRepository;
    private final DailyFortuneRepository dailyFortuneRepository;
    private final SajuCalculatorService calculatorService;
    private final GeminiApiService geminiApiService;
    private final Gson gson = new Gson();

    /**
     * 오늘의 운세 조회 (캐싱 적용)
     */
    @Transactional
    public DailyFortuneResponse getTodayFortune(DailyFortuneRequest request) {
        log.info("오늘의 운세 조회 시작: {}-{}-{}", request.getYear(), request.getMonth(), request.getDay());

        LocalDate today = LocalDate.now();

        // BirthData 조회 또는 생성
        BirthData birthData = findOrCreateBirthData(request);

        // 오늘 날짜의 운세가 이미 있는지 확인
        Optional<DailyFortune> existingFortune = dailyFortuneRepository
                .findByBirthDataAndFortuneDate(birthData, today);

        if (existingFortune.isPresent()) {
            log.info("캐시된 오늘의 운세 반환: id={}", existingFortune.get().getId());
            return convertToResponse(existingFortune.get());
        }

        // 새로운 운세 생성
        DailyFortune fortune = generateDailyFortune(birthData, today);
        fortune = dailyFortuneRepository.save(fortune);

        log.info("오늘의 운세 생성 완료: id={}", fortune.getId());
        return convertToResponse(fortune);
    }

    /**
     * BirthData 조회 또는 생성
     */
    private BirthData findOrCreateBirthData(DailyFortuneRequest request) {
        // 동일한 생년월일 정보가 있는지 조회
        Optional<BirthData> existingBirthData = birthDataRepository.findAll().stream()
                .filter(bd -> bd.getYear().equals(request.getYear())
                        && bd.getMonth().equals(request.getMonth())
                        && bd.getDay().equals(request.getDay())
                        && bd.getHour().equals(request.getHour())
                        && bd.getMinute().equals(request.getMinute())
                        && bd.getGender().equals(request.getGender())
                        && bd.getIsLunar().equals(request.getIsLunar()))
                .findFirst();

        if (existingBirthData.isPresent()) {
            return existingBirthData.get();
        }

        // 새로운 BirthData 생성
        BirthData birthData = BirthData.builder()
                .year(request.getYear())
                .month(request.getMonth())
                .day(request.getDay())
                .hour(request.getHour())
                .minute(request.getMinute())
                .gender(request.getGender())
                .isLunar(request.getIsLunar())
                .build();

        return birthDataRepository.save(birthData);
    }

    /**
     * 일일 운세 생성
     */
    private DailyFortune generateDailyFortune(BirthData birthData, LocalDate targetDate) {
        // 사주팔자 계산
        Map<String, String> pillars = calculatorService.calculateFourPillars(birthData);

        // AI 프롬프트 생성
        String prompt = buildDailyFortunePrompt(pillars, birthData, targetDate);

        // Gemini API 호출
        String responseText = geminiApiService.sendAnalysisRequest(prompt);

        // 응답 파싱
        Map<String, Object> fortuneData = parseDailyFortuneResponse(responseText);

        // DailyFortune 엔티티 생성
        return DailyFortune.builder()
                .birthData(birthData)
                .fortuneDate(targetDate)
                .overallFortune((String) fortuneData.get("overallFortune"))
                .loveFortune((String) fortuneData.get("loveFortune"))
                .moneyFortune((String) fortuneData.get("moneyFortune"))
                .workFortune((String) fortuneData.get("workFortune"))
                .healthFortune((String) fortuneData.get("healthFortune"))
                .luckyColor((String) fortuneData.get("luckyColor"))
                .luckyNumber(((Double) fortuneData.get("luckyNumber")).intValue())
                .luckyDirection((String) fortuneData.get("luckyDirection"))
                .luckyTime((String) fortuneData.get("luckyTime"))
                .advice((String) fortuneData.get("advice"))
                .fortuneScore(((Double) fortuneData.get("fortuneScore")).intValue())
                .build();
    }

    /**
     * 오늘의 운세 프롬프트 생성
     */
    private String buildDailyFortunePrompt(Map<String, String> pillars, BirthData birthData, LocalDate targetDate) {
        String calendar = birthData.getIsLunar() ? "음력" : "양력";
        String genderStr = birthData.getGender().name().equals("MALE") ? "남성" : "여성";

        return String.format("""
                당신은 전문 사주명리학자입니다. 다음 사주를 가진 사람의 %s 오늘의 운세를 분석해주세요.

                생년월일: %s %d년 %d월 %d일 %d시 %d분 (%s)

                사주팔자:
                - 년주: %s
                - 월주: %s
                - 일주: %s
                - 시주: %s

                오늘 날짜: %s

                다음 형식의 JSON으로 오늘의 운세를 작성해주세요:
                {
                  "overallFortune": "전반적인 오늘의 운세 (100-150자)",
                  "loveFortune": "애정운 (50-80자)",
                  "moneyFortune": "재물운 (50-80자)",
                  "workFortune": "직업운 (50-80자)",
                  "healthFortune": "건강운 (50-80자)",
                  "luckyColor": "행운의 색상 (한 가지)",
                  "luckyNumber": 행운의 숫자 (1-100),
                  "luckyDirection": "행운의 방향 (동/서/남/북)",
                  "luckyTime": "행운의 시간대 (예: 오전 9시-11시)",
                  "advice": "오늘의 조언 (80-100자)",
                  "fortuneScore": 오늘의 운세 점수 (0-100)
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
    private Map<String, Object> parseDailyFortuneResponse(String responseText) {
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
     * Entity를 DTO로 변환
     */
    private DailyFortuneResponse convertToResponse(DailyFortune fortune) {
        BirthData birthData = fortune.getBirthData();

        return DailyFortuneResponse.builder()
                .id(fortune.getId())
                .fortuneDate(fortune.getFortuneDate())
                .year(birthData.getYear())
                .month(birthData.getMonth())
                .day(birthData.getDay())
                .hour(birthData.getHour())
                .minute(birthData.getMinute())
                .gender(birthData.getGender())
                .isLunar(birthData.getIsLunar())
                .overallFortune(fortune.getOverallFortune())
                .loveFortune(fortune.getLoveFortune())
                .moneyFortune(fortune.getMoneyFortune())
                .workFortune(fortune.getWorkFortune())
                .healthFortune(fortune.getHealthFortune())
                .luckyColor(fortune.getLuckyColor())
                .luckyNumber(fortune.getLuckyNumber())
                .luckyDirection(fortune.getLuckyDirection())
                .luckyTime(fortune.getLuckyTime())
                .advice(fortune.getAdvice())
                .fortuneScore(fortune.getFortuneScore())
                .createdAt(fortune.getCreatedAt())
                .build();
    }
}
