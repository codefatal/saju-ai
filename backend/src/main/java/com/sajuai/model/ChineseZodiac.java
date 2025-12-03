package com.sajuai.model;

/**
 * 12띠 (십이지신)
 */
public enum ChineseZodiac {
    RAT("쥐", "子", 0),
    OX("소", "丑", 1),
    TIGER("호랑이", "寅", 2),
    RABBIT("토끼", "卯", 3),
    DRAGON("용", "辰", 4),
    SNAKE("뱀", "巳", 5),
    HORSE("말", "午", 6),
    GOAT("양", "未", 7),
    MONKEY("원숭이", "申", 8),
    ROOSTER("닭", "酉", 9),
    DOG("개", "戌", 10),
    PIG("돼지", "亥", 11);

    private final String koreanName;
    private final String chineseCharacter;
    private final int index;

    ChineseZodiac(String koreanName, String chineseCharacter, int index) {
        this.koreanName = koreanName;
        this.chineseCharacter = chineseCharacter;
        this.index = index;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public String getChineseCharacter() {
        return chineseCharacter;
    }

    public int getIndex() {
        return index;
    }

    /**
     * 년도로부터 띠 계산 (1900년 = 쥐띠)
     */
    public static ChineseZodiac fromYear(int year) {
        int index = (year - 4) % 12;
        if (index < 0) index += 12;

        for (ChineseZodiac zodiac : values()) {
            if (zodiac.index == index) {
                return zodiac;
            }
        }
        return RAT;
    }

    /**
     * 한글 이름으로 띠 찾기
     */
    public static ChineseZodiac fromKoreanName(String name) {
        for (ChineseZodiac zodiac : values()) {
            if (zodiac.koreanName.equals(name)) {
                return zodiac;
            }
        }
        throw new IllegalArgumentException("알 수 없는 띠: " + name);
    }
}
