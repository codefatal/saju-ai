package com.sajuai.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_fortune")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyFortune {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "birth_data_id", nullable = false)
    private BirthData birthData;

    @Column(nullable = false)
    private LocalDate fortuneDate;

    @Column(columnDefinition = "TEXT")
    private String overallFortune;

    @Column(columnDefinition = "TEXT")
    private String loveFortune;

    @Column(columnDefinition = "TEXT")
    private String moneyFortune;

    @Column(columnDefinition = "TEXT")
    private String workFortune;

    @Column(columnDefinition = "TEXT")
    private String healthFortune;

    @Column(length = 20)
    private String luckyColor;

    private Integer luckyNumber;

    @Column(length = 100)
    private String luckyDirection;

    @Column(length = 100)
    private String luckyTime;

    @Column(columnDefinition = "TEXT")
    private String advice;

    private Integer fortuneScore;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
