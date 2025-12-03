package com.sajuai.dto;

import com.sajuai.model.ChineseZodiac;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZodiacFortuneResponse {

    private ChineseZodiac zodiac;
    private String zodiacName;
    private String zodiacCharacter;
    private LocalDate date;

    // 종합 운세
    private String overallFortune;

    // 세부 운세
    private String loveFortune;
    private String moneyFortune;
    private String workFortune;
    private String healthFortune;

    // 운세 점수
    private Integer loveScore;
    private Integer moneyScore;
    private Integer workScore;
    private Integer healthScore;
    private Integer overallScore;

    // 행운 요소
    private String luckyColor;
    private Integer luckyNumber;
    private String luckyDirection;

    // 주의사항
    private String caution;

    // 오늘의 조언
    private String advice;
}
