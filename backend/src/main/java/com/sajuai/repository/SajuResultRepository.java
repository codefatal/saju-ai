package com.sajuai.repository;

import com.sajuai.model.SajuResult;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SajuResultRepository extends JpaRepository<SajuResult, Long> {

    /**
     * 최근 분석 결과 조회
     */
    List<SajuResult> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
