package com.sajuai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NameAnalysisRequest {
    @NotBlank(message = "이름을 입력해주세요")
    private String name;

    private String purpose; // CURRENT (현재 이름 분석), NEW (작명/개명)

    // 생년월일 정보 (선택)
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;
    private String gender;
}
