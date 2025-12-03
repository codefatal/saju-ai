package com.sajuai.dto;

import com.sajuai.model.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyFortuneRequest {

    @NotNull(message = "년도는 필수입니다")
    @Min(value = 1900, message = "년도는 1900년 이상이어야 합니다")
    @Max(value = 2100, message = "년도는 2100년 이하여야 합니다")
    private Integer year;

    @NotNull(message = "월은 필수입니다")
    @Min(value = 1, message = "월은 1-12 사이여야 합니다")
    @Max(value = 12, message = "월은 1-12 사이여야 합니다")
    private Integer month;

    @NotNull(message = "일은 필수입니다")
    @Min(value = 1, message = "일은 1-31 사이여야 합니다")
    @Max(value = 31, message = "일은 1-31 사이여야 합니다")
    private Integer day;

    @NotNull(message = "시간은 필수입니다")
    @Min(value = 0, message = "시간은 0-23 사이여야 합니다")
    @Max(value = 23, message = "시간은 0-23 사이여야 합니다")
    private Integer hour;

    @NotNull(message = "분은 필수입니다")
    @Min(value = 0, message = "분은 0-59 사이여야 합니다")
    @Max(value = 59, message = "분은 0-59 사이여야 합니다")
    private Integer minute;

    @NotNull(message = "성별은 필수입니다")
    private Gender gender;

    @NotNull(message = "음력/양력 구분은 필수입니다")
    private Boolean isLunar;
}
