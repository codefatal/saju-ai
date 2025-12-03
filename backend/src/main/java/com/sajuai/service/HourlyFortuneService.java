package com.sajuai.service;

import com.sajuai.dto.HourlyFortuneResponse;
import com.sajuai.dto.HourlyFortuneResponse.HourlyData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 시간대 운세 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class HourlyFortuneService {

    // 12시간 시간대
    private static final String[] TIME_RANGES = {
        "23:00-01:00", "01:00-03:00", "03:00-05:00", "05:00-07:00",
        "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00",
        "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00"
    };

    private static final String[] KOREAN_TIMES = {
        "자시", "축시", "인시", "묘시",
        "진시", "사시", "오시", "미시",
        "신시", "유시", "술시", "해시"
    };

    private static final String[] FORTUNES = {
        "길한 시간입니다. 중요한 일을 시작하기 좋습니다.",
        "평온한 시간입니다. 휴식을 취하세요.",
        "약간의 주의가 필요합니다. 신중하게 행동하세요.",
        "매우 좋은 시간입니다. 주요 결정을 하기 좋습니다.",
        "조용한 시간입니다. 명상이나 계획 수립에 좋습니다.",
        "활기찬 시간입니다. 대담한 행동이 좋습니다.",
        "안정적인 시간입니다. 일상적인 업무를 추진하세요.",
        "창의적인 에너지가 흐르는 시간입니다.",
        "인간관계가 좋아지는 시간입니다. 만남을 가지세요.",
        "재물운이 좋은 시간입니다. 금전거래를 고려하세요.",
        "휴식과 회복의 시간입니다.",
        "행운의 시간입니다. 새로운 시도를 해보세요."
    };

    /**
     * 시간대 운세 조회
     */
    public HourlyFortuneResponse getHourlyFortune() {
        log.info("시간대 운세 생성 시작");

        List<HourlyData> hours = new ArrayList<>();
        Random random = new Random(LocalDate.now().toString().hashCode());

        for (int i = 0; i < 12; i++) {
            int score = 20 + random.nextInt(80);
            boolean isGoodTime = score >= 60;

            HourlyData hourly = HourlyData.builder()
                    .timeRange(TIME_RANGES[i])
                    .koreanTime(KOREAN_TIMES[i])
                    .fortune(FORTUNES[i])
                    .score(score)
                    .recommendation(getRecommendation(score))
                    .isGoodTime(isGoodTime)
                    .build();

            hours.add(hourly);
        }

        log.info("시간대 운세 생성 완료");

        return HourlyFortuneResponse.builder()
                .date(LocalDate.now().toString())
                .hours(hours)
                .build();
    }

    /**
     * 점수에 따른 조언 생성
     */
    private String getRecommendation(int score) {
        if (score >= 80) {
            return "✨ 매우 좋은 시간. 중요한 일을 진행하세요.";
        } else if (score >= 60) {
            return "✅ 좋은 시간. 계획된 업무를 추진하세요.";
        } else if (score >= 40) {
            return "⏸️ 평온한 시간. 일상적인 일을 하세요.";
        } else {
            return "🔇 주의가 필요한 시간. 신중하게 행동하세요.";
        }
    }
}
