package com.sajuai.repository;

import com.sajuai.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserId(Long userId);

    void deleteByToken(String token);

    void deleteByUserId(Long userId);

    void deleteByExpiresAtBefore(LocalDateTime expiresAt);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.id = :userId ORDER BY rt.createdAt DESC LIMIT 5")
    List<RefreshToken> findTop5ByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
