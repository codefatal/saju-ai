package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TojeongResponse {
    private Integer year;
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;

    // 12개월 운세
    private List<MonthlyFortune> monthlyFortunes;

    // 연간 종합 운세
    private String yearlyOverview;
    private Integer yearlyScore; // 0-100
    private String bestMonth;    // 최고의 달
    private String worstMonth;   // 주의해야 할 달
    private String yearlyAdvice; // 연간 조언

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyFortune {
        private Integer month;
        private String monthName;
        private Integer score;          // 0-100
        private String rating;          // EXCELLENT, GOOD, FAIR, POOR
        private String overallFortune;  // 전반적인 운세
        private String luckyStar;       // 길성/흉성
        private String advice;          // 조언
        private List<String> goodThings;  // 좋은 일
        private List<String> warningThings; // 주의할 일
    }
}
