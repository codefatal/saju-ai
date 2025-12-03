package com.sajuai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TarotReadingRequest {
    @NotBlank(message = "질문은 필수입니다")
    private String question;

    private String category; // LOVE, CAREER, MONEY, HEALTH, GENERAL

    private String name; // 선택사항
}
