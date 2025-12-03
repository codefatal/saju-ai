package com.sajuai.controller;

import com.sajuai.dto.NameAnalysisRequest;
import com.sajuai.dto.NameAnalysisResponse;
import com.sajuai.service.NameAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/name")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class NameController {

    private final NameAnalysisService nameAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<NameAnalysisResponse> analyzeName(@Valid @RequestBody NameAnalysisRequest request) {
        log.info("이름 분석 요청: {}", request.getName());
        try {
            NameAnalysisResponse response = nameAnalysisService.analyzeName(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("이름 분석 실패: {}", e.getMessage(), e);
            throw new RuntimeException("이름 분석에 실패했습니다: " + e.getMessage());
        }
    }
}
