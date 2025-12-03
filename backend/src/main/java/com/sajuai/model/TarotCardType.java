package com.sajuai.model;

import lombok.Getter;

@Getter
public enum TarotCardType {
    // Major Arcana (메이저 아르카나)
    THE_FOOL("The Fool", "바보", "새로운 시작, 순수함, 자유로움"),
    THE_MAGICIAN("The Magician", "마법사", "창조력, 의지, 능력"),
    THE_HIGH_PRIESTESS("The High Priestess", "여사제", "직관, 신비, 내면의 지혜"),
    THE_EMPRESS("The Empress", "여황제", "풍요, 창조, 모성애"),
    THE_EMPEROR("The Emperor", "황제", "권위, 안정, 구조"),
    THE_HIEROPHANT("The Hierophant", "교황", "전통, 가르침, 영적 지도"),
    THE_LOVERS("The Lovers", "연인", "선택, 사랑, 조화"),
    THE_CHARIOT("The Chariot", "전차", "승리, 의지력, 통제"),
    STRENGTH("Strength", "힘", "용기, 인내, 내면의 힘"),
    THE_HERMIT("The Hermit", "은둔자", "성찰, 고독, 내면 탐구"),
    WHEEL_OF_FORTUNE("Wheel of Fortune", "운명의 수레바퀴", "운명, 변화, 순환"),
    JUSTICE("Justice", "정의", "공정함, 진실, 인과응보"),
    THE_HANGED_MAN("The Hanged Man", "매달린 사람", "희생, 관점 전환, 정지"),
    DEATH("Death", "죽음", "종말, 변화, 재탄생"),
    TEMPERANCE("Temperance", "절제", "균형, 조화, 중용"),
    THE_DEVIL("The Devil", "악마", "유혹, 속박, 물질주의"),
    THE_TOWER("The Tower", "탑", "파괴, 급변, 깨달음"),
    THE_STAR("The Star", "별", "희망, 영감, 치유"),
    THE_MOON("The Moon", "달", "불안, 환상, 무의식"),
    THE_SUN("The Sun", "태양", "성공, 기쁨, 활력"),
    JUDGEMENT("Judgement", "심판", "부활, 깨달음, 결정"),
    THE_WORLD("The World", "세계", "완성, 성취, 통합");

    private final String englishName;
    private final String koreanName;
    private final String basicMeaning;

    TarotCardType(String englishName, String koreanName, String basicMeaning) {
        this.englishName = englishName;
        this.koreanName = koreanName;
        this.basicMeaning = basicMeaning;
    }
}
