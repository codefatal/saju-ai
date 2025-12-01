package com.sajuai.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "saju_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SajuResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "birth_data_id", nullable = false)
    private BirthData birthData;

    @Column(nullable = false, length = 50)
    private String yearPillar;

    @Column(nullable = false, length = 50)
    private String monthPillar;

    @Column(nullable = false, length = 50)
    private String dayPillar;

    @Column(nullable = false, length = 50)
    private String hourPillar;

    @Column(columnDefinition = "TEXT")
    private String personality;

    @Column(columnDefinition = "TEXT")
    private String fortune;

    @Column(columnDefinition = "TEXT")
    private String career;

    @Column(columnDefinition = "TEXT")
    private String relationship;

    @Column(columnDefinition = "TEXT")
    private String health;

    @Column(columnDefinition = "TEXT")
    private String advice;

    @Column(length = 500)
    private String luckyColors;

    @Column(length = 500)
    private String luckyNumbers;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
