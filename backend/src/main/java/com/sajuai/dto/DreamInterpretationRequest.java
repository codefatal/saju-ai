package com.sajuai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DreamInterpretationRequest {
    @NotBlank(message = "꿈 내용을 입력해주세요")
    private String dreamContent;

    private String category; // PERSON, ANIMAL, NATURE, OBJECT, ACTION, EMOTION, OTHER
    private String name;
    private String mood; // 꿈의 분위기 (긍정적, 부정적, 중립적)
}
