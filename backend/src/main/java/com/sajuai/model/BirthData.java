package com.sajuai.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "birth_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BirthData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "birth_year", nullable = false)
    private Integer year;

    @Column(name = "birth_month", nullable = false)
    private Integer month;

    @Column(name = "birth_day", nullable = false)
    private Integer day;

    @Column(name = "birth_hour", nullable = false)
    private Integer hour;

    @Column(name = "birth_minute", nullable = false)
    private Integer minute;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private Boolean isLunar;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
