package com.sajuai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TojeongRequest {
    @NotNull(message = "연도를 입력해주세요")
    @Min(value = 1900, message = "1900년 이후만 가능합니다")
    @Max(value = 2100, message = "2100년 이전만 가능합니다")
    private Integer year;

    @NotNull(message = "생년을 입력해주세요")
    @Min(value = 1900, message = "1900년 이후만 가능합니다")
    @Max(value = 2100, message = "2100년 이전만 가능합니다")
    private Integer birthYear;

    @NotNull(message = "생월을 입력해주세요")
    @Min(value = 1, message = "1~12월 사이만 가능합니다")
    @Max(value = 12, message = "1~12월 사이만 가능합니다")
    private Integer birthMonth;

    @NotNull(message = "생일을 입력해주세요")
    @Min(value = 1, message = "1~31일 사이만 가능합니다")
    @Max(value = 31, message = "1~31일 사이만 가능합니다")
    private Integer birthDay;

    private String gender; // MALE, FEMALE
}
