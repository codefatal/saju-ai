package com.sajuai.service;

import com.sajuai.dto.DailyZodiacCompatibilityRequest;
import com.sajuai.dto.DailyZodiacCompatibilityResponse;
import com.sajuai.dto.DailyZodiacCompatibilityResponse.ZodiacCompatibility;
import com.sajuai.model.ChineseZodiac;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 띠별 오늘의 궁합 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DailyZodiacCompatibilityService {

    // 띠별 기본 궁합 점수 (상생/상극 관계)
    private static final int[][] BASE_COMPATIBILITY = {
        // 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지
        {50, 85, 40, 60, 90, 70, 35, 65, 80, 75, 55, 45}, // 쥐
        {85, 50, 55, 75, 80, 90, 60, 70, 65, 85, 40, 80}, // 소
        {40, 55, 50, 65, 75, 60, 85, 90, 50, 60, 95, 80}, // 호랑이
        {60, 75, 65, 50, 70, 80, 55, 85, 70, 75, 90, 95}, // 토끼
        {90, 80, 75, 70, 50, 85, 65, 75, 95, 90, 70, 80}, // 용
        {70, 90, 60, 80, 85, 50, 40, 75, 95, 85, 65, 70}, // 뱀
        {35, 60, 85, 55, 65, 40, 50, 90, 60, 55, 85, 75}, // 말
        {65, 70, 90, 85, 75, 75, 90, 50, 70, 60, 80, 95}, // 양
        {80, 65, 50, 70, 95, 95, 60, 70, 50, 75, 60, 85}, // 원숭이
        {75, 85, 60, 75, 90, 85, 55, 60, 75, 50, 65, 70}, // 닭
        {55, 40, 95, 90, 70, 65, 85, 80, 60, 65, 50, 75}, // 개
        {45, 80, 80, 95, 80, 70, 75, 95, 85, 70, 75, 50}  // 돼지
    };

    /**
     * 오늘의 띠별 궁합 조회
     */
    public DailyZodiacCompatibilityResponse getDailyCompatibility(DailyZodiacCompatibilityRequest request) {
        log.info("띠별 오늘의 궁합 생성 시작: {}", request.getZodiac().getKoreanName());

        ChineseZodiac myZodiac = request.getZodiac();
        LocalDate today = LocalDate.now();
        Random random = new Random(today.toString().hashCode() + myZodiac.ordinal());

        List<ZodiacCompatibility> compatibilities = new ArrayList<>();
        int bestScore = 0;
        int worstScore = 100;
        String bestMatch = "";
        String worstMatch = "";

        // 12띠 전체에 대한 궁합 생성
        ChineseZodiac[] allZodiacs = ChineseZodiac.values();
        for (int i = 0; i < allZodiacs.length; i++) {
            ChineseZodiac otherZodiac = allZodiacs[i];

            // 자기 자신은 제외
            if (otherZodiac == myZodiac) {
                continue;
            }

            // 기본 궁합 점수에 오늘의 변동 적용 (-10 ~ +10)
            int baseScore = BASE_COMPATIBILITY[myZodiac.ordinal()][otherZodiac.ordinal()];
            int dailyVariation = random.nextInt(21) - 10;
            int finalScore = Math.max(20, Math.min(100, baseScore + dailyVariation));

            String relationship = getRelationship(finalScore);
            String advice = getAdvice(finalScore, otherZodiac.getKoreanName());

            boolean isBest = false;
            boolean isWorst = false;

            if (finalScore > bestScore) {
                bestScore = finalScore;
                bestMatch = otherZodiac.getKoreanName();
            }
            if (finalScore < worstScore) {
                worstScore = finalScore;
                worstMatch = otherZodiac.getKoreanName();
            }

            ZodiacCompatibility compatibility = ZodiacCompatibility.builder()
                    .zodiac(otherZodiac.getKoreanName())
                    .zodiacCharacter(otherZodiac.getChineseCharacter())
                    .score(finalScore)
                    .relationship(relationship)
                    .advice(advice)
                    .isBestMatch(isBest)
                    .isWorstMatch(isWorst)
                    .build();

            compatibilities.add(compatibility);
        }

        // 최고/최악 궁합 표시 업데이트
        for (ZodiacCompatibility comp : compatibilities) {
            if (comp.getZodiac().equals(bestMatch)) {
                compatibilities.set(compatibilities.indexOf(comp),
                    ZodiacCompatibility.builder()
                        .zodiac(comp.getZodiac())
                        .zodiacCharacter(comp.getZodiacCharacter())
                        .score(comp.getScore())
                        .relationship(comp.getRelationship())
                        .advice(comp.getAdvice())
                        .isBestMatch(true)
                        .isWorstMatch(false)
                        .build());
            } else if (comp.getZodiac().equals(worstMatch)) {
                compatibilities.set(compatibilities.indexOf(comp),
                    ZodiacCompatibility.builder()
                        .zodiac(comp.getZodiac())
                        .zodiacCharacter(comp.getZodiacCharacter())
                        .score(comp.getScore())
                        .relationship(comp.getRelationship())
                        .advice(comp.getAdvice())
                        .isBestMatch(false)
                        .isWorstMatch(true)
                        .build());
            }
        }

        String todayMessage = getTodayMessage(myZodiac.getKoreanName(), bestMatch);

        log.info("띠별 오늘의 궁합 생성 완료");

        return DailyZodiacCompatibilityResponse.builder()
                .date(today.toString())
                .myZodiac(myZodiac.getKoreanName())
                .myZodiacCharacter(myZodiac.getChineseCharacter())
                .todayMessage(todayMessage)
                .compatibilities(compatibilities)
                .bestMatch(bestMatch)
                .worstMatch(worstMatch)
                .build();
    }

    /**
     * 점수에 따른 관계 설명
     */
    private String getRelationship(int score) {
        if (score >= 90) return "최상의 궁합";
        if (score >= 80) return "매우 좋은 궁합";
        if (score >= 70) return "좋은 궁합";
        if (score >= 60) return "괜찮은 궁합";
        if (score >= 50) return "보통 궁합";
        if (score >= 40) return "주의 필요";
        return "조심스러운 관계";
    }

    /**
     * 점수에 따른 조언
     */
    private String getAdvice(int score, String otherZodiac) {
        if (score >= 90) {
            return otherZodiac + "띠와 함께하면 행운이 찾아올 것입니다.";
        } else if (score >= 70) {
            return otherZodiac + "띠와의 만남이 긍정적인 영향을 줄 것입니다.";
        } else if (score >= 50) {
            return otherZodiac + "띠와 무난한 관계를 유지할 수 있습니다.";
        } else {
            return otherZodiac + "띠와는 오늘 신중하게 대하세요.";
        }
    }

    /**
     * 오늘의 메시지
     */
    private String getTodayMessage(String myZodiac, String bestMatch) {
        return myZodiac + "띠인 당신! 오늘은 " + bestMatch +
               "띠와 함께하면 좋은 날입니다. 적극적으로 교류해보세요!";
    }
}
