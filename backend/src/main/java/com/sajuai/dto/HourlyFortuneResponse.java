package com.sajuai.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

/**
 * 시간대 운세 응답 DTO
 */
@Getter
@Builder
public class HourlyFortuneResponse {
    private String date;
    private List<HourlyData> hours;

    @Getter
    @Builder
    public static class HourlyData {
        private String timeRange;
        private String koreanTime;
        private String fortune;
        private int score;
        private String recommendation;
        private boolean isGoodTime;
    }
}
