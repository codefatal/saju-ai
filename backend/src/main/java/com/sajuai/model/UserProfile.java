package com.sajuai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "year")
    private Integer year;  // 생년

    @Column(name = "month")
    private Integer month;  // 월

    @Column(name = "day")
    private Integer day;  // 일

    @Column(name = "hour")
    private Integer hour;  // 시

    @Column(name = "minute")
    private Integer minute;  // 분

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;  // MALE, FEMALE, NOT_SPECIFIED

    @Column(name = "is_lunar")
    private Boolean isLunar;  // 음력 여부

    @Column(name = "birth_data_id")
    private Long birthDataId;  // BirthData 테이블 FK

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Gender {
        MALE,
        FEMALE,
        NOT_SPECIFIED
    }

    public void updateBirthInfo(Integer year, Integer month, Integer day, Integer hour, Integer minute, Gender gender, Boolean isLunar) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.gender = gender;
        this.isLunar = isLunar;
    }

    public void updateBirthDataId(Long birthDataId) {
        this.birthDataId = birthDataId;
    }

    public boolean isProfileComplete() {
        return year != null && month != null && day != null && gender != null && isLunar != null;
    }
}
