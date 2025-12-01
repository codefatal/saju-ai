package com.sajuai.repository;

import com.sajuai.model.BirthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BirthDataRepository extends JpaRepository<BirthData, Long> {
}
