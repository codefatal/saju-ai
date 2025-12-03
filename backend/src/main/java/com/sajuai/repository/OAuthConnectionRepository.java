package com.sajuai.repository;

import com.sajuai.model.OAuthConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OAuthConnectionRepository extends JpaRepository<OAuthConnection, Long> {

    Optional<OAuthConnection> findByProviderAndProviderId(OAuthConnection.Provider provider, String providerId);

    List<OAuthConnection> findByUserId(Long userId);

    List<OAuthConnection> findByUserIdAndDisconnectedAtIsNull(Long userId);

    Optional<OAuthConnection> findByUserIdAndProvider(Long userId, OAuthConnection.Provider provider);
}
