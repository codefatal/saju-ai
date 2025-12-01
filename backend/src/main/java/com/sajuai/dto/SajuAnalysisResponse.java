package com.sajuai.dto;

import com.sajuai.model.Gender;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SajuAnalysisResponse {

    private Long id;

    // Birth Data
    private Integer year;
    private Integer month;
    private Integer day;
    private Integer hour;
    private Integer minute;
    private Gender gender;
    private Boolean isLunar;

    // Four Pillars
    private String yearPillar;
    private String monthPillar;
    private String dayPillar;
    private String hourPillar;

    // Analysis Results
    private String personality;
    private String fortune;
    private String career;
    private String relationship;
    private String health;
    private String advice;
    private List<String> luckyColors;
    private List<Integer> luckyNumbers;

    private LocalDateTime createdAt;
}
