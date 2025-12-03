package com.sajuai.dto;

import com.sajuai.model.ChineseZodiac;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZodiacFortuneRequest {

    @NotNull(message = "띠는 필수입니다")
    private ChineseZodiac zodiac;

    // 선택적: 특정 날짜의 운세 (null이면 오늘)
    private String targetDate; // yyyy-MM-dd 형식
}
