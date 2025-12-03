package com.sajuai.service;

import com.sajuai.auth.JwtTokenProvider;
import com.sajuai.dto.OAuth2LoginResponse;
import com.sajuai.dto.TokenRefreshRequest;
import com.sajuai.dto.TokenRefreshResponse;
import com.sajuai.model.*;
import com.sajuai.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OAuthConnectionRepository oauthConnectionRepository;

    public AuthService(
            JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            RefreshTokenRepository refreshTokenRepository,
            OAuthConnectionRepository oauthConnectionRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.oauthConnectionRepository = oauthConnectionRepository;
    }

    /**
     * OAuth 사용자 로그인/회원가입 처리
     *
     * @param email      사용자 이메일
     * @param username   사용자명
     * @param provider   OAuth 제공자 (GOOGLE, KAKAO)
     * @param providerId OAuth 제공자 사용자 ID
     * @param profileImageUrl 프로필 이미지 URL
     * @return OAuth2LoginResponse
     */
    public OAuth2LoginResponse loginOrRegisterOAuthUser(
            String email,
            String username,
            User.OAuthProvider provider,
            String providerId,
            String profileImageUrl) {

        // 기존 사용자 확인
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // 프로필 이미지 업데이트
            if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
                user.updateProfileImage(profileImageUrl);
            }
            // 사용자명 업데이트
            if (username != null && !username.isEmpty()) {
                user.updateUsername(username);
            }
        } else {
            // 신규 사용자 생성
            user = User.builder()
                    .email(email)
                    .username(username != null ? username : email.split("@")[0])
                    .provider(provider)
                    .providerId(providerId)
                    .profileImageUrl(profileImageUrl)
                    .isActive(true)
                    .build();

            user = userRepository.save(user);

            // 사용자 프로필 생성 (초기 상태: 사주 정보 없음)
            UserProfile userProfile = UserProfile.builder()
                    .user(user)
                    .build();

            userProfileRepository.save(userProfile);
        }

        // OAuth 연결 정보 저장/업데이트
        Optional<OAuthConnection> existingConnection = oauthConnectionRepository
                .findByUserIdAndProvider(user.getId(), OAuthConnection.Provider.valueOf(provider.name()));

        if (existingConnection.isPresent()) {
            OAuthConnection connection = existingConnection.get();
            connection.reconnect();  // 기존 연결 활성화
        } else {
            OAuthConnection connection = OAuthConnection.builder()
                    .user(user)
                    .provider(OAuthConnection.Provider.valueOf(provider.name()))
                    .providerId(providerId)
                    .email(email)
                    .build();

            oauthConnectionRepository.save(connection);
        }

        // 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getUsername(), provider.name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Refresh Token 저장
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        // 프로필 완성 여부 확인
        UserProfile userProfile = userProfileRepository.findByUserId(user.getId()).get();
        boolean hasProfile = userProfile.isProfileComplete();

        return OAuth2LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(OAuth2LoginResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .profileImageUrl(user.getProfileImageUrl())
                        .provider(user.getProvider().name())
                        .hasProfile(hasProfile)
                        .build())
                .build();
    }

    /**
     * Refresh Token으로 새로운 Access Token 발급
     *
     * @param request TokenRefreshRequest
     * @return TokenRefreshResponse
     */
    public TokenRefreshResponse refreshAccessToken(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        // Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        // Refresh Token 데이터베이스에서 조회
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found in database"));

        if (!tokenEntity.isValid()) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        // 사용자 정보 조회
        User user = tokenEntity.getUser();

        // 새로운 Access Token 생성
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProvider().name());

        // 새로운 Refresh Token 생성 (선택적)
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // 기존 Refresh Token 삭제 및 새로운 토큰 저장
        refreshTokenRepository.deleteByToken(refreshToken);

        RefreshToken newTokenEntity = RefreshToken.builder()
                .user(user)
                .token(newRefreshToken)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(newTokenEntity);

        // 만료된 토큰 정리 (5개 이상 유지)
        cleanupOldRefreshTokens(user.getId());

        return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    /**
     * 로그아웃 처리 (Refresh Token 삭제)
     *
     * @param refreshToken Refresh Token
     */
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
        log.info("User logged out successfully");
    }

    /**
     * 사용자 ID로 로그아웃 (모든 Refresh Token 삭제)
     *
     * @param userId 사용자 ID
     */
    public void logoutAllDevices(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("User {} logged out from all devices", userId);
    }

    /**
     * 오래된 Refresh Token 정리 (사용자당 최대 5개 유지)
     *
     * @param userId 사용자 ID
     */
    private void cleanupOldRefreshTokens(Long userId) {
        var activeTokens = refreshTokenRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);

        if (activeTokens.size() > 5) {
            for (int i = 5; i < activeTokens.size(); i++) {
                refreshTokenRepository.delete(activeTokens.get(i));
            }
        }

        // 만료된 토큰 삭제
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    /**
     * 사용자 정보 조회
     *
     * @param userId 사용자 ID
     * @return User
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    /**
     * 이메일로 사용자 조회
     *
     * @param email 이메일
     * @return User
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    /**
     * OAuth 제공자와 제공자 ID로 사용자 조회
     *
     * @param provider OAuth 제공자
     * @param providerId 제공자 사용자 ID
     * @return User
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByProviderAndProviderId(User.OAuthProvider provider, String providerId) {
        return userRepository.findByProviderAndProviderId(provider, providerId);
    }

    /**
     * OAuth 제공자 연결 해제
     *
     * @param userId 사용자 ID
     * @param provider OAuth 제공자 (GOOGLE, KAKAO)
     */
    public void disconnectOAuthProvider(Long userId, String provider) {
        User user = getUserById(userId);

        try {
            OAuthConnection.Provider providerEnum = OAuthConnection.Provider.valueOf(provider.toUpperCase());

            oauthConnectionRepository.findByUserIdAndProvider(userId, providerEnum)
                    .ifPresent(OAuthConnection::disconnect);

            log.info("OAuth provider {} disconnected for user {}", provider, userId);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid provider: " + provider);
        }
    }
}
