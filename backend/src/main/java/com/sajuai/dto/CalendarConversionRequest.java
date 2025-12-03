package com.sajuai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CalendarConversionRequest {
    @NotNull(message = "년도는 필수입니다")
    @Min(value = 1900, message = "년도는 1900년 이상이어야 합니다")
    @Max(value = 2100, message = "년도는 2100년 이하여야 합니다")
    private Integer year;

    @NotNull(message = "월은 필수입니다")
    @Min(value = 1, message = "월은 1 이상이어야 합니다")
    @Max(value = 12, message = "월은 12 이하여야 합니다")
    private Integer month;

    @NotNull(message = "일은 필수입니다")
    @Min(value = 1, message = "일은 1 이상이어야 합니다")
    @Max(value = 31, message = "일은 31 이하여야 합니다")
    private Integer day;

    @NotNull(message = "음력 여부는 필수입니다")
    private Boolean isLunar;

    // 음력일 경우 윤달 여부
    private Boolean isLeapMonth = false;
}
