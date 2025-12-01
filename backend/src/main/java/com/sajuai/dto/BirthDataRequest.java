package com.sajuai.dto;

import com.sajuai.model.Gender;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BirthDataRequest {

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

    @NotNull(message = "시는 필수입니다")
    @Min(value = 0, message = "시는 0 이상이어야 합니다")
    @Max(value = 23, message = "시는 23 이하여야 합니다")
    private Integer hour;

    @NotNull(message = "분은 필수입니다")
    @Min(value = 0, message = "분은 0 이상이어야 합니다")
    @Max(value = 59, message = "분은 59 이하여야 합니다")
    private Integer minute;

    @NotNull(message = "성별은 필수입니다")
    private Gender gender;

    @NotNull(message = "음력 여부는 필수입니다")
    private Boolean isLunar;
}
