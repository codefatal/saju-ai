package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompatibilityResponse {
    // 첫 번째 사람 정보
    private String person1Name;
    private String person1Saju; // 사주팔자 요약

    // 두 번째 사람 정보
    private String person2Name;
    private String person2Saju; // 사주팔자 요약

    // 궁합 점수 (0-100)
    private Integer overallScore;
    private Integer loveScore;
    private Integer marriageScore;
    private Integer businessScore;
    private Integer friendshipScore;

    // 궁합 분석 내용
    private String overallCompatibility; // 전반적인 궁합
    private String loveCompatibility; // 애정 궁합
    private String marriageCompatibility; // 결혼 궁합
    private String businessCompatibility; // 사업 궁합
    private String friendshipCompatibility; // 우정 궁합

    // 조언 및 주의사항
    private String strengths; // 강점
    private String weaknesses; // 약점
    private String advice; // 조언

    // 궁합 등급
    private String compatibilityGrade; // 최상, 상, 중, 하
}
