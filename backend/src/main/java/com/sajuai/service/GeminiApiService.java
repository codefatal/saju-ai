package com.sajuai.service;

import com.google.gson.Gson;
import com.sajuai.config.GeminiApiConfig;
import com.sajuai.dto.GeminiRequest;
import com.sajuai.dto.GeminiResponse;
import com.sajuai.exception.GeminiApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Gemini API 호출 서비스
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiApiService {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient httpClient;
    private final GeminiApiConfig apiConfig;
    private final Gson gson = new Gson();

    /**
     * Gemini API에 분석 요청 전송
     *
     * @param prompt 사주 분석 프롬프트
     * @return Gemini의 응답 텍스트
     */
    public String sendAnalysisRequest(String prompt) {
        log.debug("Gemini API 요청 시작");

        // 요청 객체 생성
        GeminiRequest.Content content = new GeminiRequest.Content(
            List.of(new GeminiRequest.Part(prompt))
        );

        GeminiRequest request = GeminiRequest.builder()
                .contents(List.of(content))
                .generationConfig(GeminiRequest.GenerationConfig.builder()
                        .temperature(0.7)
                        .maxOutputTokens(8192)
                        .build())
                .build();

        String requestBody = gson.toJson(request);
        log.debug("요청 본문: {}", requestBody);

        // HTTP 요청 생성 (x-goog-api-key 헤더 사용)
        Request httpRequest = new Request.Builder()
                .url(GEMINI_API_URL)
                .addHeader("Content-Type", "application/json")
                .addHeader("x-goog-api-key", apiConfig.getApiKey())
                .post(RequestBody.create(requestBody, JSON))
                .build();

        // API 호출
        try (Response response = httpClient.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                log.error("Gemini API 호출 실패: {} - {}", response.code(), errorBody);
                throw new GeminiApiException("Gemini API 호출 실패: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            log.debug("응답 본문: {}", responseBody);

            // 응답 파싱
            GeminiResponse geminiResponse = gson.fromJson(responseBody, GeminiResponse.class);

            if (geminiResponse.getCandidates() == null || geminiResponse.getCandidates().isEmpty()) {
                throw new GeminiApiException("Gemini API 응답에 컨텐츠가 없습니다");
            }

            GeminiResponse.Candidate candidate = geminiResponse.getCandidates().get(0);

            // parts가 null인 경우 체크
            if (candidate.getContent() == null ||
                candidate.getContent().getParts() == null ||
                candidate.getContent().getParts().isEmpty()) {

                String finishReason = candidate.getFinishReason() != null ? candidate.getFinishReason() : "UNKNOWN";
                log.error("Gemini API 응답에 텍스트가 없습니다. finishReason: {}", finishReason);
                throw new GeminiApiException("Gemini API 응답 생성 실패: " + finishReason +
                    ". maxOutputTokens를 늘려보세요.");
            }

            String resultText = candidate.getContent().getParts().get(0).getText();
            log.debug("Gemini API 요청 완료");

            return resultText;

        } catch (IOException e) {
            log.error("Gemini API 호출 중 오류 발생", e);
            throw new GeminiApiException("Gemini API 호출 중 오류 발생", e);
        }
    }
}
