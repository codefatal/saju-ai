package com.sajuai.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

/**
 * 띠별 오늘의 궁합 응답 DTO
 */
@Getter
@Builder
public class DailyZodiacCompatibilityResponse {
    private String date;
    private String myZodiac;
    private String myZodiacCharacter;
    private String todayMessage;
    private List<ZodiacCompatibility> compatibilities;
    private String bestMatch;
    private String worstMatch;

    @Getter
    @Builder
    public static class ZodiacCompatibility {
        private String zodiac;
        private String zodiacCharacter;
        private int score;
        private String relationship;
        private String advice;
        private boolean isBestMatch;
        private boolean isWorstMatch;
    }
}
