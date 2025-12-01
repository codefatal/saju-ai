package com.sajuai.service;

import com.google.gson.Gson;
import com.sajuai.config.ClaudeApiConfig;
import com.sajuai.dto.ClaudeRequest;
import com.sajuai.dto.ClaudeResponse;
import com.sajuai.exception.ClaudeApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Claude API 호출 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ClaudeApiService {

    private static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-sonnet-4-20250514";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient httpClient;
    private final ClaudeApiConfig apiConfig;
    private final Gson gson = new Gson();

    /**
     * Claude API에 분석 요청 전송
     *
     * @param prompt 사주 분석 프롬프트
     * @return Claude의 응답 텍스트
     */
    public String sendAnalysisRequest(String prompt) {
        log.debug("Claude API 요청 시작");

        // 요청 객체 생성
        ClaudeRequest.Message message = new ClaudeRequest.Message("user", prompt);
        ClaudeRequest request = ClaudeRequest.builder()
                .model(MODEL)
                .messages(List.of(message))
                .max_tokens(2048)
                .build();

        String requestBody = gson.toJson(request);
        log.debug("요청 본문: {}", requestBody);

        // HTTP 요청 생성
        Request httpRequest = new Request.Builder()
                .url(CLAUDE_API_URL)
                .addHeader("x-api-key", apiConfig.getApiKey())
                .addHeader("anthropic-version", "2023-06-01")
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody, JSON))
                .build();

        // API 호출
        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                log.error("Claude API 호출 실패: {} - {}", response.code(), errorBody);
                throw new ClaudeApiException("Claude API 호출 실패: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            log.debug("응답 본문: {}", responseBody);

            // 응답 파싱
            ClaudeResponse claudeResponse = gson.fromJson(responseBody, ClaudeResponse.class);

            if (claudeResponse.getContent() == null || claudeResponse.getContent().isEmpty()) {
                throw new ClaudeApiException("Claude API 응답에 컨텐츠가 없습니다");
            }

            String resultText = claudeResponse.getContent().get(0).getText();
            log.debug("Claude API 요청 완료");

            return resultText;

        } catch (IOException e) {
            log.error("Claude API 호출 중 오류 발생", e);
            throw new ClaudeApiException("Claude API 호출 중 오류 발생", e);
        }
    }
}
