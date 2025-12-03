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
public class NameAnalysisResponse {
    private String name;
    private String purpose;

    // 이름 구성
    private List<CharacterAnalysis> characters;

    // 획수 분석
    private Integer totalStrokes;       // 총획
    private Integer heavenStrokes;      // 천격
    private Integer earthStrokes;       // 지격
    private Integer personalityStrokes; // 인격
    private Integer outerStrokes;       // 외격
    private Integer totalStrokesForte;  // 총격

    // 오행 분석
    private String heavenElement;       // 천격 오행
    private String earthElement;        // 지격 오행
    private String personalityElement;  // 인격 오행
    private String elementBalance;      // 오행 균형

    // 종합 평가
    private Integer overallScore;       // 0-100
    private String overallRating;       // EXCELLENT, GOOD, FAIR, POOR
    private String nameMeaning;         // 이름의 의미
    private String personalityAnalysis; // 성격 분석
    private String fortuneAnalysis;     // 운세 분석
    private String compatibility;       // 사주와의 궁합 (생년월일 제공시)

    // 강점과 약점
    private List<String> strengths;
    private List<String> weaknesses;

    // 조언
    private String advice;
    private List<String> luckyColors;
    private List<String> luckyNumbers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CharacterAnalysis {
        private String character;       // 한자
        private String meaning;         // 의미
        private Integer strokes;        // 획수
        private String pronunciation;   // 발음
        private String element;         // 오행
    }
}
