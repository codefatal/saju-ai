package com.sajuai.repository;

import com.sajuai.model.BirthData;
import com.sajuai.model.DailyFortune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyFortuneRepository extends JpaRepository<DailyFortune, Long> {

    Optional<DailyFortune> findByBirthDataAndFortuneDate(BirthData birthData, LocalDate fortuneDate);

    Optional<DailyFortune> findTopByBirthDataOrderByFortuneDateDesc(BirthData birthData);
}
