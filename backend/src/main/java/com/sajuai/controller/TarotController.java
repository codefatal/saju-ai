package com.sajuai.controller;

import com.sajuai.dto.TarotReadingRequest;
import com.sajuai.dto.TarotReadingResponse;
import com.sajuai.service.TarotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/tarot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Tarot", description = "타로 카드 리딩 API")
public class TarotController {

    private final TarotService tarotService;

    @PostMapping("/reading")
    @Operation(summary = "타로 카드 리딩", description = "질문에 대한 타로 카드 3장 리딩을 제공합니다")
    public ResponseEntity<TarotReadingResponse> getTarotReading(
            @Valid @RequestBody TarotReadingRequest request) {
        log.info("Tarot reading request - Question: {}, Category: {}",
                request.getQuestion(), request.getCategory());

        TarotReadingResponse response = tarotService.getTarotReading(request);
        return ResponseEntity.ok(response);
    }
}
