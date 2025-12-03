package com.sajuai.dto;

import com.sajuai.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyFortuneResponse {

    private Long id;
    private LocalDate fortuneDate;

    // 생년월일 정보
    private Integer year;
    private Integer month;
    private Integer day;
    private Integer hour;
    private Integer minute;
    private Gender gender;
    private Boolean isLunar;

    // 운세 내용
    private String overallFortune;
    private String loveFortune;
    private String moneyFortune;
    private String workFortune;
    private String healthFortune;

    // 행운 요소
    private String luckyColor;
    private Integer luckyNumber;
    private String luckyDirection;
    private String luckyTime;

    private String advice;
    private Integer fortuneScore;

    private LocalDateTime createdAt;
}
