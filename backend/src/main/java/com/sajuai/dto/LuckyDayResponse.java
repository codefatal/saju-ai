package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LuckyDayResponse {
    private String purpose;
    private LocalDate startDate;
    private LocalDate endDate;

    // 길일 추천
    private List<LuckyDay> luckyDays;
    private List<LocalDate> avoidDays; // 피해야 할 날

    // 전체 조언
    private String overallAdvice;
    private String bestTimeOfDay; // 최적 시간대

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LuckyDay {
        private LocalDate date;
        private String dayOfWeek;
        private Integer score;           // 길일 점수 (1-100)
        private String rating;           // EXCELLENT, GOOD, FAIR
        private String reason;           // 길일 이유
        private String lunarDate;        // 음력 날짜
        private String ganzi;            // 간지
        private List<String> goodFor;    // 적합한 일
        private List<String> avoidFor;   // 피해야 할 일
        private String timeRecommendation; // 시간대 추천
    }
}
