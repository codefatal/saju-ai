package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarConversionResponse {
    // 입력 정보
    private Integer inputYear;
    private Integer inputMonth;
    private Integer inputDay;
    private Boolean inputIsLunar;
    private Boolean inputIsLeapMonth;

    // 변환된 정보
    private Integer convertedYear;
    private Integer convertedMonth;
    private Integer convertedDay;
    private Boolean convertedIsLunar;
    private Boolean convertedIsLeapMonth;

    // 추가 정보
    private String inputDateString;      // 예: "양력 1990년 5월 15일"
    private String convertedDateString;  // 예: "음력 1990년 4월 21일"
    private String weekDay;              // 요일
    private String ganzi;                // 간지 (예: "경오년 신사월 갑자일")
}
