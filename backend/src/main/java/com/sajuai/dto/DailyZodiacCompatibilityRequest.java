package com.sajuai.dto;

import com.sajuai.model.ChineseZodiac;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 띠별 오늘의 궁합 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyZodiacCompatibilityRequest {

    @NotNull(message = "띠를 선택해주세요")
    private ChineseZodiac zodiac;
}
