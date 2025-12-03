package com.sajuai.controller;

import com.sajuai.dto.DreamInterpretationRequest;
import com.sajuai.dto.DreamInterpretationResponse;
import com.sajuai.service.DreamInterpretationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/dream")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Dream", description = "꿈 해몽 API")
public class DreamController {

    private final DreamInterpretationService dreamInterpretationService;

    @PostMapping("/interpret")
    @Operation(summary = "꿈 해몽", description = "꿈 내용을 분석하여 해몽 결과를 제공합니다")
    public ResponseEntity<DreamInterpretationResponse> interpretDream(
            @Valid @RequestBody DreamInterpretationRequest request) {
        log.info("Dream interpretation request - Category: {}, Content length: {}",
                request.getCategory(), request.getDreamContent().length());

        DreamInterpretationResponse response = dreamInterpretationService.interpretDream(request);
        return ResponseEntity.ok(response);
    }
}
