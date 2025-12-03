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
public class TarotReadingResponse {
    private String question;
    private String category;
    private String name;

    // 3장의 카드 (과거, 현재, 미래)
    private List<TarotCard> cards;

    // 종합 해석
    private String overallReading;
    private String advice;
    private String warning;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TarotCard {
        private String name;           // 카드 이름
        private String nameKorean;     // 한글 이름
        private String position;       // PAST, PRESENT, FUTURE
        private Boolean isReversed;    // 정방향/역방향
        private String meaning;        // 기본 의미
        private String interpretation; // 맥락 해석
        private String keyword;        // 핵심 키워드
    }
}
