package com.sajuai.controller;

import com.sajuai.auth.JwtTokenProvider;
import com.sajuai.dto.*;
import com.sajuai.model.User;
import com.sajuai.service.AuthService;
import com.sajuai.service.OAuth2Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final OAuth2Service oauth2Service;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, OAuth2Service oauth2Service, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.oauth2Service = oauth2Service;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Google OAuth 콜백 처리
     *
     * @param request OAuth2LoginRequest
     * @return OAuth2LoginResponse
     */
    @PostMapping("/oauth/google/callback")
    public ResponseEntity<OAuth2LoginResponse> googleCallback(@RequestBody OAuth2LoginRequest request) {
        try {
            log.info("Processing Google OAuth callback");

            // Google OAuth 서비스에서 사용자 정보 조회
            OAuth2Service.UserInfo userInfo = oauth2Service.getGoogleUserInfo(request.getCode());

            // 사용자 로그인/회원가입
            OAuth2LoginResponse response = authService.loginOrRegisterOAuthUser(
                    userInfo.getEmail(),
                    userInfo.getName(),
                    User.OAuthProvider.GOOGLE,
                    userInfo.getId(),
                    userInfo.getPictureUrl());

            log.info("Google login successful for user: {}", userInfo.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Google OAuth callback failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    /**
     * Kakao OAuth 콜백 처리
     *
     * @param request OAuth2LoginRequest
     * @return OAuth2LoginResponse
     */
    @PostMapping("/oauth/kakao/callback")
    public ResponseEntity<OAuth2LoginResponse> kakaoCallback(@RequestBody OAuth2LoginRequest request) {
        try {
            log.info("Processing Kakao OAuth callback");

            // Kakao OAuth 서비스에서 사용자 정보 조회
            OAuth2Service.UserInfo userInfo = oauth2Service.getKakaoUserInfo(request.getCode());

            // 사용자 로그인/회원가입
            OAuth2LoginResponse response = authService.loginOrRegisterOAuthUser(
                    userInfo.getEmail(),
                    userInfo.getName(),
                    User.OAuthProvider.KAKAO,
                    userInfo.getId(),
                    userInfo.getPictureUrl());

            log.info("Kakao login successful for user: {}", userInfo.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Kakao OAuth callback failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
    }

    /**
     * Access Token 갱신
     *
     * @param request TokenRefreshRequest
     * @return TokenRefreshResponse
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        try {
            TokenRefreshResponse response = authService.refreshAccessToken(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    /**
     * 로그아웃
     *
     * @param request TokenRefreshRequest
     * @return ResponseEntity
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody TokenRefreshRequest request) {
        try {
            authService.logout(request.getRefreshToken());
            return ResponseEntity.ok().body(new MessageResponse("Logged out successfully"));
        } catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Logout failed"));
        }
    }

    /**
     * 현재 로그인 사용자 정보 조회
     *
     * @param authHeader Authorization 헤더
     * @return UserDTO
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtTokenProvider.resolveToken(authHeader);

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            User user = authService.getUserById(userId);

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .profileImageUrl(user.getProfileImageUrl())
                    .provider(user.getProvider().name())
                    .isActive(user.getIsActive())
                    .build();

            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            log.error("Failed to get current user", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    /**
     * 소셜 계정 연결 해제
     *
     * @param provider OAuth 제공자
     * @param authHeader Authorization 헤더
     * @return ResponseEntity
     */
    @PostMapping("/disconnect/{provider}")
    public ResponseEntity<?> disconnectProvider(
            @PathVariable String provider,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtTokenProvider.resolveToken(authHeader);

            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Unauthorized"));
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            authService.disconnectOAuthProvider(userId, provider);

            return ResponseEntity.ok(new MessageResponse("OAuth provider disconnected successfully"));
        } catch (Exception e) {
            log.error("Failed to disconnect OAuth provider", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Failed to disconnect OAuth provider"));
        }
    }

    /**
     * 응답 메시지 DTO
     */
    public static class MessageResponse {
        public String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
