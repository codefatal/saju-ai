package com.sajuai.controller;

import com.sajuai.dto.CompatibilityRequest;
import com.sajuai.dto.CompatibilityResponse;
import com.sajuai.service.CompatibilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/compatibility")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Compatibility", description = "궁합 분석 API")
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    @PostMapping("/analyze")
    @Operation(summary = "궁합 분석", description = "두 사람의 생년월일시로 궁합을 분석합니다")
    public ResponseEntity<CompatibilityResponse> analyzeCompatibility(
            @Valid @RequestBody CompatibilityRequest request) {
        log.info("Compatibility analysis request for: {} and {}",
                request.getPerson1Name() != null ? request.getPerson1Name() : "Person1",
                request.getPerson2Name() != null ? request.getPerson2Name() : "Person2");

        CompatibilityResponse response = compatibilityService.analyzeCompatibility(request);
        return ResponseEntity.ok(response);
    }
}
