package com.sajuai.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClaudeResponse {

    private String id;
    private String type;
    private String role;
    private List<Content> content;
    private String model;
    private String stop_reason;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private String type;
        private String text;
    }
}
