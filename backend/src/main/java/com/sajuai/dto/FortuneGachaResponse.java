package com.sajuai.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 운세 뽑기 응답 DTO
 */
@Getter
@Builder
public class FortuneGachaResponse {
    private String title;
    private String fortune;
    private String emoji;
    private int score; // 0-100
    private String color;
    private String advice;
}
