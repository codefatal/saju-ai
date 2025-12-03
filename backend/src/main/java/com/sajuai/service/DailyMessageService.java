package com.sajuai.service;

import com.sajuai.dto.DailyMessageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 오늘의 한마디 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DailyMessageService {

    private final GeminiApiService geminiApiService;

    // 사주 기반 격려 메시지들
    private static final List<String> MESSAGES = Arrays.asList(
            "오늘은 새로운 기회가 찾아올 날입니다. 용감하게 도전해보세요.",
            "당신의 노력은 반드시 보상받을 것입니다. 계속 나아가세요.",
            "이 순간이 중요합니다. 현재에 집중하세요.",
            "어려움 뒤에는 항상 좋은 일이 있습니다. 희망을 잃지 마세요.",
            "오늘 만난 사람들이 당신의 운을 바꿀 수 있습니다.",
            "작은 결정이 큰 변화를 만듭니다. 신중하세요.",
            "당신의 직관을 믿으세요. 그것이 당신을 올바른 길로 인도할 것입니다.",
            "긍정적인 마음이 모든 것을 바꿉니다. 웃음을 잃지 마세요.",
            "이 도전은 당신을 더 강하게 만들 것입니다.",
            "운은 준비된 자에게만 찾아옵니다. 오늘도 열심히 하세요.",
            "당신은 충분히 잘하고 있습니다. 자신감을 가지세요.",
            "오늘의 선택이 내일을 만듭니다. 신중하고 현명하세요.",
            "주변 사람들의 응원을 잊지 마세요. 함께라면 모든 것이 가능합니다.",
            "실패는 성공의 밑거름입니다. 계속 앞으로 나아가세요.",
            "당신의 가치는 결과로 측정되지 않습니다. 소중한 사람입니다."
    );

    private static final List<String> EMOJIS = Arrays.asList(
            "✨", "🌟", "💫", "🎯", "💪", "🔥", "🚀", "🌈", "💎", "🍀",
            "😊", "👏", "🙌", "💝", "⭐"
    );

    private static final List<String> KEYWORDS = Arrays.asList(
            "용기", "희망", "성실", "노력", "믿음", "행운", "성공", "성장",
            "감사", "긍정", "도전", "포기금지", "화이팅", "응원", "축복"
    );

    /**
     * 오늘의 한마디 조회
     */
    public DailyMessageResponse getDailyMessage() {
        log.info("오늘의 한마디 생성 시작");

        String today = LocalDate.now().toString();
        Random random = new Random(today.hashCode());

        String message = MESSAGES.get(random.nextInt(MESSAGES.size()));
        String emoji = EMOJIS.get(random.nextInt(EMOJIS.size()));
        String keyword = KEYWORDS.get(random.nextInt(KEYWORDS.size()));

        // Gemini API를 사용하여 확장된 조언 생성
        String advice = generateExtendedAdvice(message, keyword);

        log.info("오늘의 한마디 생성 완료");

        return DailyMessageResponse.builder()
                .message(message)
                .emoji(emoji)
                .keyword(keyword)
                .advice(advice)
                .build();
    }

    /**
     * AI를 통한 확장된 조언 생성
     */
    private String generateExtendedAdvice(String message, String keyword) {
        try {
            String prompt = String.format("""
                    다음 메시지와 키워드를 바탕으로 간단한 실생활 조언을 만들어주세요.

                    메시지: %s
                    키워드: %s

                    50자 이내의 실질적이고 도움이 되는 조언을 한 문장으로 작성해주세요.
                    """, message, keyword);

            String advice = geminiApiService.sendAnalysisRequest(prompt);
            return advice.trim();
        } catch (Exception e) {
            log.warn("AI 조언 생성 실패, 기본값 사용", e);
            return "오늘 하루를 소중히 여기고 최선을 다하세요.";
        }
    }
}
