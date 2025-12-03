package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sajuai.dto.LuckyDayRequest;
import com.sajuai.dto.LuckyDayResponse;
import com.sajuai.model.BirthData;
import com.sajuai.model.Gender;
import com.github.usingsky.calendar.KoreanLunarCalendar;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LuckyDayService {

    private final GeminiApiService geminiApiService;
    private final SajuCalculatorService sajuCalculatorService;
    private final Gson gson = new Gson();

    private static final String[] HEAVENLY_STEMS = {"갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"};
    private static final String[] EARTHLY_BRANCHES = {"자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"};

    public LuckyDayResponse findLuckyDays(LuckyDayRequest request) {
        try {
            // 날짜 범위 검증
            long daysBetween = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
            if (daysBetween > 365) {
                throw new IllegalArgumentException("날짜 범위는 최대 1년까지 가능합니다");
            }
            if (daysBetween < 0) {
                throw new IllegalArgumentException("종료 날짜가 시작 날짜보다 이전입니다");
            }

            // 날짜별 간지 정보 수집
            List<DateInfo> dateInfos = collectDateInfos(request.getStartDate(), request.getEndDate());

            // 사용자 사주 계산 (생년월일 정보가 있는 경우)
            String userSaju = null;
            if (request.getBirthYear() != null && request.getBirthMonth() != null && request.getBirthDay() != null) {
                userSaju = calculateUserSaju(request);
            }

            // Gemini API에 길일 분석 요청
            String prompt = buildLuckyDayPrompt(request, dateInfos, userSaju);
            String responseText = geminiApiService.sendAnalysisRequest(prompt);

            // JSON 응답 파싱
            JsonObject jsonResponse = parseJsonResponse(responseText);

            // 길일 리스트 생성
            List<LuckyDayResponse.LuckyDay> luckyDays = new ArrayList<>();
            JsonArray daysArray = jsonResponse.getAsJsonArray("luckyDays");
            for (int i = 0; i < daysArray.size(); i++) {
                JsonObject dayJson = daysArray.get(i).getAsJsonObject();

                // goodFor와 avoidFor 배열 처리
                List<String> goodFor = new ArrayList<>();
                JsonArray goodForArray = dayJson.getAsJsonArray("goodFor");
                for (int j = 0; j < goodForArray.size(); j++) {
                    goodFor.add(goodForArray.get(j).getAsString());
                }

                List<String> avoidFor = new ArrayList<>();
                JsonArray avoidForArray = dayJson.getAsJsonArray("avoidFor");
                for (int j = 0; j < avoidForArray.size(); j++) {
                    avoidFor.add(avoidForArray.get(j).getAsString());
                }

                luckyDays.add(LuckyDayResponse.LuckyDay.builder()
                        .date(LocalDate.parse(dayJson.get("date").getAsString()))
                        .dayOfWeek(dayJson.get("dayOfWeek").getAsString())
                        .score(dayJson.get("score").getAsInt())
                        .rating(dayJson.get("rating").getAsString())
                        .reason(dayJson.get("reason").getAsString())
                        .lunarDate(dayJson.get("lunarDate").getAsString())
                        .ganzi(dayJson.get("ganzi").getAsString())
                        .goodFor(goodFor)
                        .avoidFor(avoidFor)
                        .timeRecommendation(dayJson.get("timeRecommendation").getAsString())
                        .build());
            }

            // 피해야 할 날짜 리스트
            List<LocalDate> avoidDays = new ArrayList<>();
            JsonArray avoidArray = jsonResponse.getAsJsonArray("avoidDays");
            for (int i = 0; i < avoidArray.size(); i++) {
                avoidDays.add(LocalDate.parse(avoidArray.get(i).getAsString()));
            }

            return LuckyDayResponse.builder()
                    .purpose(request.getPurpose())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .luckyDays(luckyDays)
                    .avoidDays(avoidDays)
                    .overallAdvice(jsonResponse.get("overallAdvice").getAsString())
                    .bestTimeOfDay(jsonResponse.get("bestTimeOfDay").getAsString())
                    .build();

        } catch (Exception e) {
            log.error("Lucky day calculation failed: {}", e.getMessage(), e);
            throw new RuntimeException("길일 선택에 실패했습니다: " + e.getMessage());
        }
    }

    private List<DateInfo> collectDateInfos(LocalDate startDate, LocalDate endDate) {
        List<DateInfo> dateInfos = new ArrayList<>();
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            DateInfo info = new DateInfo();
            info.date = current;
            info.dayOfWeek = getDayOfWeekKorean(current);

            // 간지 계산
            info.ganzi = calculateGanzi(current);

            // 음력 계산
            try {
                KoreanLunarCalendar calendar = KoreanLunarCalendar.getInstance();
                calendar.setSolarDate(current.getYear(), current.getMonthValue(), current.getDayOfMonth());
                String[] lunarParts = calendar.getLunarIsoFormat().split("-");
                info.lunarDate = String.format("%s년 %s월 %s일", lunarParts[0], lunarParts[1], lunarParts[2]);
            } catch (Exception e) {
                info.lunarDate = "음력 계산 불가";
            }

            dateInfos.add(info);
            current = current.plusDays(1);
        }

        return dateInfos;
    }

    private String calculateGanzi(LocalDate date) {
        // 1984년 2월 4일 = 갑자년 기준
        LocalDate baseDate = LocalDate.of(1984, 1, 1);
        long daysSinceBase = ChronoUnit.DAYS.between(baseDate, date);

        int stemIndex = (int) ((daysSinceBase + 0) % 10);
        int branchIndex = (int) ((daysSinceBase + 0) % 12);

        if (stemIndex < 0) stemIndex += 10;
        if (branchIndex < 0) branchIndex += 12;

        return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
    }

    private String getDayOfWeekKorean(LocalDate date) {
        String[] days = {"월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"};
        return days[date.getDayOfWeek().getValue() - 1];
    }

    private String calculateUserSaju(LuckyDayRequest request) {
        try {
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

            return String.format("년주: %s, 월주: %s, 일주: %s",
                    fourPillars.get("yearPillar"),
                    fourPillars.get("monthPillar"),
                    fourPillars.get("dayPillar"));
        } catch (Exception e) {
            log.warn("Failed to calculate user saju: {}", e.getMessage());
            return null;
        }
    }

    private String buildLuckyDayPrompt(LuckyDayRequest request, List<DateInfo> dateInfos, String userSaju) {
        String purposeText = getPurposeText(request.getPurpose());

        // 날짜 정보를 간결하게 문자열로 변환
        String dateInfoText = dateInfos.stream()
                .map(info -> String.format("%s(%s): %s, %s",
                        info.date, info.dayOfWeek, info.ganzi, info.lunarDate))
                .collect(Collectors.joining("\n"));

        String userSajuText = userSaju != null ? "\n\n[의뢰인 사주]\n" + userSaju : "";

        return String.format("""
                당신은 전문 택일(擇日) 전문가입니다. 다음 날짜 범위에서 목적에 맞는 길일을 추천해주세요.

                [목적]
                %s

                [날짜 범위]
                %s ~ %s
                (총 %d일)%s

                [날짜별 정보]
                %s

                다음 형식의 JSON으로 응답해주세요:
                {
                  "luckyDays": [
                    {
                      "date": "2025-01-15",
                      "dayOfWeek": "수요일",
                      "score": 95,
                      "rating": "EXCELLENT",
                      "reason": "이 날을 길일로 추천하는 구체적인 이유 (2-3문장)",
                      "lunarDate": "음력 12월 16일",
                      "ganzi": "갑자",
                      "goodFor": ["결혼", "개업", "계약"],
                      "avoidFor": ["이사", "여행"],
                      "timeRecommendation": "오전 9시~11시가 가장 좋습니다"
                    }
                  ],
                  "avoidDays": ["2025-01-20", "2025-01-25"],
                  "overallAdvice": "전체적인 택일 조언 (3-4문장)",
                  "bestTimeOfDay": "일반적으로 오전 시간대가 좋습니다"
                }

                택일 시 고려사항:
                - 목적(%s)에 가장 적합한 날 3-5개 선택
                - 간지, 음력 날짜, 요일 등을 종합적으로 고려
                - 전통 택일학의 원리 적용 (황도길일, 손없는날 등)
                - 피해야 할 날(흉일)도 2-3개 명시
                - 점수는 1-100 사이, rating은 EXCELLENT(90+), GOOD(70+), FAIR(50+)
                - 각 날짜별로 적합한 일과 피해야 할 일 명시
                - 구체적인 시간대 추천 포함
                """,
                purposeText,
                request.getStartDate(),
                request.getEndDate(),
                dateInfos.size(),
                userSajuText,
                dateInfoText,
                purposeText
        );
    }

    private String getPurposeText(String purpose) {
        if (purpose == null) return "기타";
        return switch (purpose) {
            case "MARRIAGE" -> "결혼";
            case "MOVING" -> "이사";
            case "BUSINESS_START" -> "개업";
            case "CONTRACT" -> "계약";
            case "TRAVEL" -> "여행";
            case "IMPORTANT_MEETING" -> "중요한 만남";
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

    private static class DateInfo {
        LocalDate date;
        String dayOfWeek;
        String ganzi;
        String lunarDate;
    }
}
