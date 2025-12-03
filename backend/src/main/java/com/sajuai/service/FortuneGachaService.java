package com.sajuai.service;

import com.sajuai.dto.FortuneGachaResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 운세 뽑기 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FortuneGachaService {

    private static final List<String> TITLES = Arrays.asList(
            "대길", "길", "중길", "평길", "소길",
            "길흉", "흉", "대흉"
    );

    private static final List<String> EMOJIS = Arrays.asList(
            "🎯", "🌟", "✨", "💫", "⭐",
            "🍀", "🎉", "💝", "🔥", "🚀"
    );

    private static final List<String> COLORS = Arrays.asList(
            "from-green-400 to-emerald-500",
            "from-blue-400 to-cyan-500",
            "from-purple-400 to-pink-500",
            "from-yellow-400 to-orange-500",
            "from-red-400 to-pink-500",
            "from-indigo-400 to-purple-500"
    );

    private static final List<String> FORTUNES = Arrays.asList(
            "오늘은 당신의 노력이 빛날 날입니다. 자신감 있게 나아가세요.",
            "예상치 못한 좋은 소식이 들려올 예정입니다.",
            "이 순간이 당신의 인생을 바꿀 수 있습니다. 놓치지 마세요.",
            "주변 사람들의 도움이 당신을 성공으로 이끌 것입니다.",
            "지금은 기다릴 때입니다. 인내심을 가지세요.",
            "새로운 시작의 시간입니다. 두려워하지 마세요.",
            "당신의 직관을 믿으세요. 그것이 답입니다.",
            "이 도전을 통해 당신은 더 강해질 것입니다.",
            "운이 당신 편입니다. 행동하세요.",
            "작은 변화가 큰 결과를 만들 것입니다.",
            "당신의 가치는 다른 사람의 평가가 아닙니다.",
            "오늘 하루는 특별한 날이 될 것 같습니다.",
            "감사하는 마음을 잃지 마세요. 그것이 행운을 부릅니다.",
            "어려움은 일시적입니다. 희망을 잃지 마세요.",
            "당신은 충분히 잘하고 있습니다. 자신감을 가지세요."
    );

    /**
     * 운세 뽑기
     */
    public FortuneGachaResponse drawFortune() {
        log.info("운세 뽑기 시작");

        Random random = new Random();
        String title = TITLES.get(random.nextInt(TITLES.size()));
        String fortune = FORTUNES.get(random.nextInt(FORTUNES.size()));
        String emoji = EMOJIS.get(random.nextInt(EMOJIS.size()));
        String color = COLORS.get(random.nextInt(COLORS.size()));
        int score = getScoreByTitle(title);

        String advice = generateAdvice(title);

        log.info("운세 뽑기 완료: {}", title);

        return FortuneGachaResponse.builder()
                .title(title)
                .fortune(fortune)
                .emoji(emoji)
                .score(score)
                .color(color)
                .advice(advice)
                .build();
    }

    /**
     * 제목에 따른 점수 계산
     */
    private int getScoreByTitle(String title) {
        return switch (title) {
            case "대길" -> 95 + new Random().nextInt(6);
            case "길" -> 80 + new Random().nextInt(15);
            case "중길" -> 60 + new Random().nextInt(20);
            case "평길" -> 50 + new Random().nextInt(10);
            case "소길" -> 30 + new Random().nextInt(20);
            case "길흉" -> 40 + new Random().nextInt(20);
            case "흉" -> 20 + new Random().nextInt(20);
            case "대흉" -> new Random().nextInt(20);
            default -> 50;
        };
    }

    /**
     * 제목에 따른 조언 생성
     */
    private String generateAdvice(String title) {
        return switch (title) {
            case "대길" -> "이 기회를 놓치지 마세요. 당신의 모든 계획이 성공할 것입니다.";
            case "길" -> "긍정적인 에너지가 가득합니다. 진행 중인 일을 계속하세요.";
            case "중길" -> "좋은 결과를 기대할 수 있습니다. 꾸준함이 중요합니다.";
            case "평길" -> "큰 변화는 없겠지만 안정적인 하루가 될 것입니다.";
            case "소길" -> "작은 행운들을 놓치지 마세요. 세심한 주의가 필요합니다.";
            case "길흉" -> "신중함이 필요합니다. 결정을 재고하세요.";
            case "흉" -> "인내심을 가지세요. 이 시간도 지나갈 것입니다.";
            case "대흉" -> "신중함과 보수적인 태도를 권합니다. 새로운 시도는 피하세요.";
            default -> "당신의 직관을 믿으세요.";
        };
    }
}
