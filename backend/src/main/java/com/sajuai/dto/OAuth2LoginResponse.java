package com.sajuai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDTO {
        private Long id;
        private String email;
        private String username;
        private String profileImageUrl;
        private String provider;
        private Boolean hasProfile;
    }
}
