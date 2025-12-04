package com.sajuai.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class OAuth2Service {

    private final OkHttpClient httpClient = new OkHttpClient();
    private final Gson gson = new Gson();

    @Value("${oauth.google.client-id}")
    private String googleClientId;

    @Value("${oauth.google.client-secret}")
    private String googleClientSecret;

    @Value("${oauth.google.token-uri}")
    private String googleTokenUri;

    @Value("${oauth.google.userinfo-uri}")
    private String googleUserinfoUri;

    @Value("${oauth.google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${oauth.kakao.client-id}")
    private String kakaoClientId;

    @Value("${oauth.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${oauth.kakao.token-uri}")
    private String kakaoTokenUri;

    @Value("${oauth.kakao.userinfo-uri}")
    private String kakaoUserinfoUri;

    @Value("${oauth.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    /**
     * Google OAuth에서 사용자 정보 조회
     *
     * @param code Authorization Code
     * @return UserInfo
     */
    public UserInfo getGoogleUserInfo(String code) {
        try {
            // 1. Authorization Code를 Access Token으로 교환
            String accessToken = getGoogleAccessToken(code);

            // 2. Access Token으로 사용자 정보 조회
            return getGoogleUserInfoWithToken(accessToken);
        } catch (Exception e) {
            log.error("Failed to get Google user info", e);
            throw new RuntimeException("Google OAuth failed", e);
        }
    }

    /**
     * Kakao OAuth에서 사용자 정보 조회
     *
     * @param code Authorization Code
     * @return UserInfo
     */
    public UserInfo getKakaoUserInfo(String code) {
        try {
            // 1. Authorization Code를 Access Token으로 교환
            String accessToken = getKakaoAccessToken(code);

            // 2. Access Token으로 사용자 정보 조회
            return getKakaoUserInfoWithToken(accessToken);
        } catch (Exception e) {
            log.error("Failed to get Kakao user info", e);
            throw new RuntimeException("Kakao OAuth failed", e);
        }
    }

    /**
     * Google Authorization Code를 Access Token으로 교환
     *
     * @param code Authorization Code
     * @return Access Token
     */
    private String getGoogleAccessToken(String code) throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", googleClientId);
        params.put("client_secret", googleClientSecret);
        params.put("redirect_uri", googleRedirectUri);
        params.put("grant_type", "authorization_code");

        RequestBody requestBody = RequestBody.create(
                gson.toJson(params),
                MediaType.parse("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(googleTokenUri)
                .post(requestBody)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                log.error("Failed to get Google access token. Status: {}, Body: {}", response.code(), errorBody);
                throw new IOException("Failed to get Google access token: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonObject = gson.fromJson(responseBody, JsonObject.class);
            return jsonObject.get("access_token").getAsString();
        }
    }

    /**
     * Google Access Token으로 사용자 정보 조회
     *
     * @param accessToken Google Access Token
     * @return UserInfo
     */
    private UserInfo getGoogleUserInfoWithToken(String accessToken) throws IOException {
        Request request = new Request.Builder()
                .url(googleUserinfoUri + "?access_token=" + accessToken)
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to get Google user info: " + response.code());
            }

            String responseBody = response.body().string();
            JsonObject jsonObject = gson.fromJson(responseBody, JsonObject.class);

            return UserInfo.builder()
                    .id(jsonObject.get("id").getAsString())
                    .email(jsonObject.get("email").getAsString())
                    .name(jsonObject.has("name") ? jsonObject.get("name").getAsString() : jsonObject.get("email").getAsString())
                    .pictureUrl(jsonObject.has("picture") ? jsonObject.get("picture").getAsString() : null)
                    .build();
        }
    }

    /**
     * Kakao Authorization Code를 Access Token으로 교환
     *
     * @param code Authorization Code
     * @return Access Token
     */
    private String getKakaoAccessToken(String code) throws IOException {
        RequestBody requestBody = new FormBody.Builder()
                .add("code", code)
                .add("client_id", kakaoClientId)
                .add("client_secret", kakaoClientSecret)
                .add("redirect_uri", kakaoRedirectUri)
                .add("grant_type", "authorization_code")
                .build();

        Request request = new Request.Builder()
                .url(kakaoTokenUri)
                .post(requestBody)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                log.error("Failed to get Kakao access token. Status: {}, Body: {}", response.code(), errorBody);
                throw new IOException("Failed to get Kakao access token: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonObject = gson.fromJson(responseBody, JsonObject.class);
            return jsonObject.get("access_token").getAsString();
        }
    }

    /**
     * Kakao Access Token으로 사용자 정보 조회
     *
     * @param accessToken Kakao Access Token
     * @return UserInfo
     */
    private UserInfo getKakaoUserInfoWithToken(String accessToken) throws IOException {
        Request request = new Request.Builder()
                .url(kakaoUserinfoUri)
                .addHeader("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to get Kakao user info: " + response.code());
            }

            String responseBody = response.body().string();
            JsonObject jsonObject = gson.fromJson(responseBody, JsonObject.class);

            // Kakao 사용자 정보 추출
            long kakaoAccountId = jsonObject.get("id").getAsLong();
            JsonObject kakaoAccount = jsonObject.getAsJsonObject("kakao_account");
            JsonObject profile = kakaoAccount.getAsJsonObject("profile");

            String email = kakaoAccount.has("email") ? kakaoAccount.get("email").getAsString() : "";
            String nickname = profile.has("nickname") ? profile.get("nickname").getAsString() : "";
            String pictureUrl = profile.has("profile_image_url") ? profile.get("profile_image_url").getAsString() : null;

            return UserInfo.builder()
                    .id(String.valueOf(kakaoAccountId))
                    .email(email)
                    .name(nickname)
                    .pictureUrl(pictureUrl)
                    .build();
        }
    }

    /**
     * OAuth 사용자 정보 DTO
     */
    @Data
    @Builder
    @AllArgsConstructor
    public static class UserInfo {
        private String id;        // OAuth 제공자 사용자 ID
        private String email;     // 이메일
        private String name;      // 사용자명
        private String pictureUrl; // 프로필 이미지 URL
    }
}
