package com.sajuai.controller;

import com.sajuai.dto.CalendarConversionRequest;
import com.sajuai.dto.CalendarConversionResponse;
import com.sajuai.service.CalendarConversionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Calendar", description = "음력/양력 변환 API")
public class CalendarController {

    private final CalendarConversionService calendarConversionService;

    @PostMapping("/convert")
    @Operation(summary = "음력/양력 변환", description = "음력을 양력으로 또는 양력을 음력으로 변환합니다")
    public ResponseEntity<CalendarConversionResponse> convertCalendar(
            @Valid @RequestBody CalendarConversionRequest request) {
        log.info("Calendar conversion request: {}/{}/{} ({})",
                request.getYear(), request.getMonth(), request.getDay(),
                request.getIsLunar() ? "음력" : "양력");

        CalendarConversionResponse response = calendarConversionService.convertCalendar(request);
        return ResponseEntity.ok(response);
    }
}
