package com.sajuai.service;

import com.sajuai.dto.UserProfileDTO;
import com.sajuai.model.User;
import com.sajuai.model.UserProfile;
import com.sajuai.repository.UserProfileRepository;
import com.sajuai.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    /**
     * 사용자 프로필 조회
     *
     * @param userId 사용자 ID
     * @return UserProfileDTO
     */
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for user id: " + userId));

        return mapToDTO(profile);
    }

    /**
     * 사용자 프로필 저장/업데이트
     *
     * @param userId 사용자 ID
     * @param profileDTO 프로필 정보
     * @return UserProfileDTO
     */
    public UserProfileDTO saveUserProfile(Long userId, UserProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found for user id: " + userId));

        // Update profile
        UserProfile.Gender gender = profileDTO.getGender() != null
                ? UserProfile.Gender.valueOf(profileDTO.getGender())
                : UserProfile.Gender.NOT_SPECIFIED;

        profile.updateBirthInfo(
                profileDTO.getName(),
                profileDTO.getYear(),
                profileDTO.getMonth(),
                profileDTO.getDay(),
                profileDTO.getHour(),
                profileDTO.getMinute(),
                gender,
                profileDTO.getIsLunar()
        );

        if (profileDTO.getBirthDataId() != null) {
            profile.updateBirthDataId(profileDTO.getBirthDataId());
        }

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("User profile updated for user: {}", userId);

        return mapToDTO(savedProfile);
    }

    /**
     * 프로필 정보를 DTO로 변환
     *
     * @param profile UserProfile entity
     * @return UserProfileDTO
     */
    private UserProfileDTO mapToDTO(UserProfile profile) {
        return UserProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getName())
                .year(profile.getYear())
                .month(profile.getMonth())
                .day(profile.getDay())
                .hour(profile.getHour())
                .minute(profile.getMinute())
                .gender(profile.getGender() != null ? profile.getGender().name() : null)
                .isLunar(profile.getIsLunar())
                .birthDataId(profile.getBirthDataId())
                .build();
    }
}
