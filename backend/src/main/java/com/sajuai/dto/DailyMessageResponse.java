package com.sajuai.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 오늘의 한마디 응답 DTO
 */
@Getter
@Builder
public class DailyMessageResponse {
    private String message;
    private String emoji;
    private String keyword;
    private String advice;
}
