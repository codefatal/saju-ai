package com.sajuai.controller;

import com.sajuai.dto.LuckyDayRequest;
import com.sajuai.dto.LuckyDayResponse;
import com.sajuai.service.LuckyDayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/lucky-day")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "LuckyDay", description = "길일 선택 API")
public class LuckyDayController {

    private final LuckyDayService luckyDayService;

    @PostMapping("/find")
    @Operation(summary = "길일 찾기", description = "목적에 맞는 길일을 추천합니다")
    public ResponseEntity<LuckyDayResponse> findLuckyDays(
            @Valid @RequestBody LuckyDayRequest request) {
        log.info("Lucky day request - Purpose: {}, Date range: {} to {}",
                request.getPurpose(), request.getStartDate(), request.getEndDate());

        LuckyDayResponse response = luckyDayService.findLuckyDays(request);
        return ResponseEntity.ok(response);
    }
}
