package com.sajuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LuckyDayRequest {
    @NotBlank(message = "목적을 선택해주세요")
    private String purpose; // MARRIAGE, MOVING, BUSINESS_START, CONTRACT, TRAVEL, IMPORTANT_MEETING, OTHER

    @NotNull(message = "시작 날짜를 입력해주세요")
    private LocalDate startDate;

    @NotNull(message = "종료 날짜를 입력해주세요")
    private LocalDate endDate;

    // 생년월일 정보 (선택)
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;
    private String gender; // MALE, FEMALE
}
