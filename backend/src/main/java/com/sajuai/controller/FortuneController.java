package com.sajuai.controller;

import com.sajuai.dto.DailyFortuneRequest;
import com.sajuai.dto.DailyFortuneResponse;
import com.sajuai.dto.DailyMessageResponse;
import com.sajuai.dto.FortuneGachaResponse;
import com.sajuai.dto.HourlyFortuneResponse;
import com.sajuai.dto.LuckyItemsResponse;
import com.sajuai.dto.ZodiacFortuneRequest;
import com.sajuai.dto.ZodiacFortuneResponse;
import com.sajuai.service.DailyFortuneService;
import com.sajuai.service.DailyMessageService;
import com.sajuai.service.FortuneGachaService;
import com.sajuai.service.HourlyFortuneService;
import com.sajuai.service.LuckyItemsService;
import com.sajuai.service.ZodiacFortuneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 운세 관련 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/fortune")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Fortune API", description = "운세 관련 API")
public class FortuneController {

    private final DailyFortuneService dailyFortuneService;
    private final LuckyItemsService luckyItemsService;
    private final ZodiacFortuneService zodiacFortuneService;
    private final DailyMessageService dailyMessageService;
    private final FortuneGachaService fortuneGachaService;
    private final HourlyFortuneService hourlyFortuneService;

    /**
     * 오늘의 운세 조회
     */
    @PostMapping("/daily")
    @Operation(summary = "오늘의 운세", description = "생년월일을 입력받아 오늘의 운세를 제공합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<DailyFortuneResponse> getDailyFortune(@Valid @RequestBody DailyFortuneRequest request) {
        log.info("POST /api/fortune/daily - 오늘의 운세 요청: {}-{}-{}",
                request.getYear(), request.getMonth(), request.getDay());

        DailyFortuneResponse response = dailyFortuneService.getTodayFortune(request);

        log.info("POST /api/fortune/daily - 오늘의 운세 완료: id={}", response.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * 오늘의 럭키 아이템 조회
     */
    @PostMapping("/lucky-items")
    @Operation(summary = "오늘의 럭키 아이템", description = "생년월일을 입력받아 오늘의 행운 아이템을 추천합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<LuckyItemsResponse> getLuckyItems(@Valid @RequestBody DailyFortuneRequest request) {
        log.info("POST /api/fortune/lucky-items - 오늘의 럭키 아이템 요청: {}-{}-{}",
                request.getYear(), request.getMonth(), request.getDay());

        LuckyItemsResponse response = luckyItemsService.getTodayLuckyItems(request);

        log.info("POST /api/fortune/lucky-items - 오늘의 럭키 아이템 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * 띠별 운세 조회
     */
    @PostMapping("/zodiac")
    @Operation(summary = "띠별 운세", description = "띠를 선택하여 오늘의 운세를 조회합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ZodiacFortuneResponse> getZodiacFortune(@Valid @RequestBody ZodiacFortuneRequest request) {
        log.info("POST /api/fortune/zodiac - 띠별 운세 요청: {}",
                request.getZodiac().getKoreanName());

        ZodiacFortuneResponse response = zodiacFortuneService.getZodiacFortune(request);

        log.info("POST /api/fortune/zodiac - 띠별 운세 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * 오늘의 한마디 조회
     */
    @GetMapping("/daily-message")
    @Operation(summary = "오늘의 한마디", description = "사주 기반 오늘의 격려 메시지를 제공합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<DailyMessageResponse> getDailyMessage() {
        log.info("GET /api/fortune/daily-message - 오늘의 한마디 요청");

        DailyMessageResponse response = dailyMessageService.getDailyMessage();

        log.info("GET /api/fortune/daily-message - 오늘의 한마디 완료");
        return ResponseEntity.ok(response);
    }

    /**
     * 운세 뽑기
     */
    @GetMapping("/gacha")
    @Operation(summary = "운세 뽑기", description = "랜덤으로 운세를 뽑습니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<FortuneGachaResponse> drawFortune() {
        log.info("GET /api/fortune/gacha - 운세 뽑기 요청");

        FortuneGachaResponse response = fortuneGachaService.drawFortune();

        log.info("GET /api/fortune/gacha - 운세 뽑기 완료: {}", response.getTitle());
        return ResponseEntity.ok(response);
    }

    /**
     * 시간대 운세 조회
     */
    @GetMapping("/hourly")
    @Operation(summary = "시간대 운세", description = "오늘의 시간대별 운세를 조회합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<HourlyFortuneResponse> getHourlyFortune() {
        log.info("GET /api/fortune/hourly - 시간대 운세 요청");

        HourlyFortuneResponse response = hourlyFortuneService.getHourlyFortune();

        log.info("GET /api/fortune/hourly - 시간대 운세 완료: {} 시간대", response.getHours().size());
        return ResponseEntity.ok(response);
    }
}
