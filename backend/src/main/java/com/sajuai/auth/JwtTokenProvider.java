package com.sajuai.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Access Token 생성
     *
     * @param userId     사용자 ID
     * @param email      사용자 이메일
     * @param username   사용자명
     * @param provider   OAuth 제공자 (GOOGLE, KAKAO, LOCAL)
     * @return JWT Access Token
     */
    public String generateAccessToken(Long userId, String email, String username, String provider) {
        return generateToken(userId, email, username, provider, accessTokenExpiration);
    }

    /**
     * Refresh Token 생성
     *
     * @param userId 사용자 ID
     * @return JWT Refresh Token
     */
    public String generateRefreshToken(Long userId) {
        return generateToken(userId, null, null, null, refreshTokenExpiration);
    }

    /**
     * JWT Token 생성
     *
     * @param userId   사용자 ID
     * @param email    사용자 이메일
     * @param username 사용자명
     * @param provider OAuth 제공자
     * @param expiration 만료 시간 (ms)
     * @return JWT Token
     */
    private String generateToken(Long userId, String email, String username, String provider, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        if (email != null) {
            claims.put("email", email);
        }
        if (username != null) {
            claims.put("username", username);
        }
        if (provider != null) {
            claims.put("provider", provider);
        }

        return Jwts.builder()
                .claims(claims)
                .subject(email != null ? email : "refresh-token")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Token에서 Claims 추출
     *
     * @param token JWT Token
     * @return Claims
     */
    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Token 유효성 검증
     *
     * @param token JWT Token
     * @return 유효 여부
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token");
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token");
            return false;
        }
    }

    /**
     * Token에서 사용자 ID 추출
     *
     * @param token JWT Token
     * @return 사용자 ID
     */
    public Long getUserIdFromToken(String token) {
        return getClaimsFromToken(token).get("userId", Long.class);
    }

    /**
     * Token에서 이메일 추출
     *
     * @param token JWT Token
     * @return 이메일
     */
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).get("email", String.class);
    }

    /**
     * Token에서 사용자명 추출
     *
     * @param token JWT Token
     * @return 사용자명
     */
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).get("username", String.class);
    }

    /**
     * Token에서 OAuth 제공자 추출
     *
     * @param token JWT Token
     * @return OAuth 제공자
     */
    public String getProviderFromToken(String token) {
        return getClaimsFromToken(token).get("provider", String.class);
    }

    /**
     * Token 만료 시간 추출
     *
     * @param token JWT Token
     * @return 만료 시간
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    /**
     * Token이 만료되었는지 확인
     *
     * @param token JWT Token
     * @return 만료 여부
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    /**
     * Token에서 Bearer 토큰 제거
     *
     * @param token Bearer token string
     * @return 토큰
     */
    public String resolveToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }
}
