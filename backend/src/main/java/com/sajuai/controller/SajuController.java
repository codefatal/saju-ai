package com.sajuai.controller;

import com.sajuai.dto.BirthDataRequest;
import com.sajuai.dto.SajuAnalysisResponse;
import com.sajuai.model.SajuResult;
import com.sajuai.service.PdfGenerationService;
import com.sajuai.service.SajuAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사주 분석 REST API 컨트롤러
 */
@RestController
@RequestMapping("/api/saju")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Saju API", description = "사주 분석 API")
public class SajuController {

    private final SajuAnalysisService analysisService;
    private final PdfGenerationService pdfGenerationService;

    /**
     * 사주 분석 요청
     */
    @PostMapping("/analyze")
    @Operation(summary = "사주 분석", description = "생년월일을 입력받아 AI 사주 분석을 수행합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "분석 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<SajuAnalysisResponse> analyzeSaju(@Valid @RequestBody BirthDataRequest request) {
        log.info("POST /api/saju/analyze - 사주 분석 요청: {}-{}-{}",
                request.getYear(), request.getMonth(), request.getDay());

        SajuAnalysisResponse response = analysisService.analyzeSaju(request);

        log.info("POST /api/saju/analyze - 사주 분석 완료: id={}", response.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * 최근 분석 이력 조회
     */
    @GetMapping("/history")
    @Operation(summary = "분석 이력 조회", description = "최근 사주 분석 이력을 조회합니다 (최대 10개)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    public ResponseEntity<List<SajuAnalysisResponse>> getHistory() {
        log.info("GET /api/saju/history - 분석 이력 조회");

        List<SajuAnalysisResponse> history = analysisService.getRecentHistory(10);

        log.info("GET /api/saju/history - 조회 완료: {} 건", history.size());
        return ResponseEntity.ok(history);
    }

    /**
     * 특정 분석 결과 조회
     */
    @GetMapping("/{id}")
    @Operation(summary = "특정 분석 결과 조회", description = "ID로 특정 사주 분석 결과를 조회합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "결과를 찾을 수 없음")
    })
    public ResponseEntity<SajuAnalysisResponse> getSajuById(@PathVariable Long id) {
        log.info("GET /api/saju/{} - 분석 결과 조회", id);

        SajuAnalysisResponse response = analysisService.getSajuById(id);

        log.info("GET /api/saju/{} - 조회 완료", id);
        return ResponseEntity.ok(response);
    }

    /**
     * PDF 다운로드
     */
    @GetMapping("/{id}/pdf")
    @Operation(summary = "PDF 다운로드", description = "사주 분석 결과를 PDF 파일로 다운로드합니다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "다운로드 성공"),
            @ApiResponse(responseCode = "404", description = "결과를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "PDF 생성 실패")
    })
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        log.info("GET /api/saju/{}/pdf - PDF 다운로드 요청", id);

        // 사주 결과 조회
        SajuResult sajuResult = analysisService.getSajuResultEntity(id);

        // PDF 생성
        byte[] pdfBytes = pdfGenerationService.generateSajuPdf(sajuResult);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "saju_result_" + id + ".pdf");
        headers.setContentLength(pdfBytes.length);

        log.info("GET /api/saju/{}/pdf - PDF 생성 완료: {} bytes", id, pdfBytes.length);
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
