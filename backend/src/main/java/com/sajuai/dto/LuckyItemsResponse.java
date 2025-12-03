package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LuckyItemsResponse {

    private LocalDate date;

    // 행운의 색상들
    private List<String> luckyColors;

    // 행운의 숫자들
    private List<Integer> luckyNumbers;

    // 행운의 음식
    private List<String> luckyFoods;

    // 행운의 향/향기
    private String luckyScent;

    // 행운의 아이템/물건
    private List<String> luckyItems;

    // 행운의 장소
    private String luckyPlace;

    // 피해야 할 것들
    private List<String> thingsToAvoid;

    // 오늘의 한마디
    private String dailyMessage;
}
