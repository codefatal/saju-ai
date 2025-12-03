package com.sajuai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "oauth_connections")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Provider provider;  // GOOGLE, KAKAO

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "email")
    private String email;

    @CreationTimestamp
    @Column(name = "connected_at")
    private LocalDateTime connectedAt;

    @Column(name = "disconnected_at")
    private LocalDateTime disconnectedAt;

    public enum Provider {
        GOOGLE,
        KAKAO
    }

    public void disconnect() {
        this.disconnectedAt = LocalDateTime.now();
    }

    public void reconnect() {
        this.disconnectedAt = null;
    }

    public boolean isConnected() {
        return disconnectedAt == null;
    }
}
