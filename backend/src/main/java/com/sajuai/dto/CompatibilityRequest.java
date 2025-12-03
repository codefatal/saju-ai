package com.sajuai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompatibilityRequest {
    // 첫 번째 사람 정보
    @NotNull(message = "첫 번째 사람의 년도는 필수입니다")
    @Min(value = 1900, message = "년도는 1900년 이상이어야 합니다")
    @Max(value = 2100, message = "년도는 2100년 이하여야 합니다")
    private Integer person1Year;

    @NotNull(message = "첫 번째 사람의 월은 필수입니다")
    @Min(value = 1, message = "월은 1 이상이어야 합니다")
    @Max(value = 12, message = "월은 12 이하여야 합니다")
    private Integer person1Month;

    @NotNull(message = "첫 번째 사람의 일은 필수입니다")
    @Min(value = 1, message = "일은 1 이상이어야 합니다")
    @Max(value = 31, message = "일은 31 이하여야 합니다")
    private Integer person1Day;

    @NotNull(message = "첫 번째 사람의 시간은 필수입니다")
    @Min(value = 0, message = "시간은 0 이상이어야 합니다")
    @Max(value = 23, message = "시간은 23 이하여야 합니다")
    private Integer person1Hour;

    @NotNull(message = "첫 번째 사람의 분은 필수입니다")
    @Min(value = 0, message = "분은 0 이상이어야 합니다")
    @Max(value = 59, message = "분은 59 이하여야 합니다")
    private Integer person1Minute;

    @NotNull(message = "첫 번째 사람의 성별은 필수입니다")
    private String person1Gender; // MALE, FEMALE

    @NotNull(message = "첫 번째 사람의 음력 여부는 필수입니다")
    private Boolean person1IsLunar;

    private String person1Name; // 선택 사항

    // 두 번째 사람 정보
    @NotNull(message = "두 번째 사람의 년도는 필수입니다")
    @Min(value = 1900, message = "년도는 1900년 이상이어야 합니다")
    @Max(value = 2100, message = "년도는 2100년 이하여야 합니다")
    private Integer person2Year;

    @NotNull(message = "두 번째 사람의 월은 필수입니다")
    @Min(value = 1, message = "월은 1 이상이어야 합니다")
    @Max(value = 12, message = "월은 12 이하여야 합니다")
    private Integer person2Month;

    @NotNull(message = "두 번째 사람의 일은 필수입니다")
    @Min(value = 1, message = "일은 1 이상이어야 합니다")
    @Max(value = 31, message = "일은 31 이하여야 합니다")
    private Integer person2Day;

    @NotNull(message = "두 번째 사람의 시간은 필수입니다")
    @Min(value = 0, message = "시간은 0 이상이어야 합니다")
    @Max(value = 23, message = "시간은 23 이하여야 합니다")
    private Integer person2Hour;

    @NotNull(message = "두 번째 사람의 분은 필수입니다")
    @Min(value = 0, message = "분은 0 이상이어야 합니다")
    @Max(value = 59, message = "분은 59 이하여야 합니다")
    private Integer person2Minute;

    @NotNull(message = "두 번째 사람의 성별은 필수입니다")
    private String person2Gender; // MALE, FEMALE

    @NotNull(message = "두 번째 사람의 음력 여부는 필수입니다")
    private Boolean person2IsLunar;

    private String person2Name; // 선택 사항
}
