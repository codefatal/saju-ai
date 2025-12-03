package com.sajuai.controller;

import com.sajuai.dto.TojeongRequest;
import com.sajuai.dto.TojeongResponse;
import com.sajuai.service.TojeongService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/tojeong")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Tojeong", description = "토정비결 API")
public class TojeongController {

    private final TojeongService tojeongService;

    @PostMapping("/fortune")
    @Operation(summary = "토정비결", description = "연간 토정비결 운세를 제공합니다")
    public ResponseEntity<TojeongResponse> getTojeongFortune(
            @Valid @RequestBody TojeongRequest request) {
        log.info("Tojeong fortune request - Year: {}, Birth: {}/{}/{}",
                request.getYear(), request.getBirthYear(), request.getBirthMonth(), request.getBirthDay());

        TojeongResponse response = tojeongService.getTojeongFortune(request);
        return ResponseEntity.ok(response);
    }
}
