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
public class DreamInterpretationResponse {
    private String dreamContent;
    private String category;
    private String name;

    // 꿈 해몽 결과
    private String overallMeaning;      // 전체적인 의미
    private String psychologicalMeaning; // 심리학적 해석
    private String traditionalMeaning;   // 전통적 해석
    private String futurePrediction;     // 미래 예측/암시

    // 상세 분석
    private List<DreamSymbol> symbols;   // 꿈 속 주요 상징
    private String luckyNumber;          // 행운의 번호
    private String advice;               // 조언
    private String warning;              // 주의사항

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DreamSymbol {
        private String symbol;           // 상징물
        private String meaning;          // 의미
        private String significance;     // 중요도 (HIGH, MEDIUM, LOW)
    }
}
