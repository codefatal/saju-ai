package com.sajuai.service;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.io.font.PdfEncodings;
import com.sajuai.model.SajuResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfGenerationService {

    private static final String FONT_PATH = "fonts/NanumGothic.ttf";

    public byte[] generateSajuPdf(SajuResult sajuResult) {
        log.info("PDF 생성 시작 - Result ID: {}", sajuResult.getId());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // 한글 폰트 설정 시도 (시스템 폰트 사용)
            PdfFont font = null;
            try {
                // Windows 기본 한글 폰트
                font = PdfFontFactory.createFont("C:/Windows/Fonts/malgun.ttf", PdfEncodings.IDENTITY_H);
            } catch (Exception e) {
                log.warn("한글 폰트 로드 실패, 기본 폰트 사용");
                font = PdfFontFactory.createFont();
            }

            // 제목
            Paragraph title = new Paragraph("모두의사주AI - 사주팔자 분석 결과")
                    .setFont(font)
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // 생년월일 정보
            addSection(document, font, "생년월일 정보",
                String.format("%d년 %d월 %d일 %d시 %d분 (%s, %s)",
                    sajuResult.getBirthData().getYear(),
                    sajuResult.getBirthData().getMonth(),
                    sajuResult.getBirthData().getDay(),
                    sajuResult.getBirthData().getHour(),
                    sajuResult.getBirthData().getMinute(),
                    sajuResult.getBirthData().getGender().name(),
                    sajuResult.getBirthData().getIsLunar() ? "음력" : "양력"
                ));

            // 사주팔자
            addSection(document, font, "사주팔자",
                String.format("년주: %s\n월주: %s\n일주: %s\n시주: %s",
                    sajuResult.getYearPillar(),
                    sajuResult.getMonthPillar(),
                    sajuResult.getDayPillar(),
                    sajuResult.getHourPillar()
                ));

            // 성격 분석
            if (sajuResult.getPersonality() != null) {
                addSection(document, font, "성격 분석", sajuResult.getPersonality());
            }

            // 운세
            if (sajuResult.getFortune() != null) {
                addSection(document, font, "종합 운세", sajuResult.getFortune());
            }

            // 직업운
            if (sajuResult.getCareer() != null) {
                addSection(document, font, "직업운", sajuResult.getCareer());
            }

            // 애정운
            if (sajuResult.getRelationship() != null) {
                addSection(document, font, "애정운", sajuResult.getRelationship());
            }

            // 건강운
            if (sajuResult.getHealth() != null) {
                addSection(document, font, "건강운", sajuResult.getHealth());
            }

            // 조언
            if (sajuResult.getAdvice() != null) {
                addSection(document, font, "조언", sajuResult.getAdvice());
            }

            // 행운의 색상과 숫자
            if (sajuResult.getLuckyColors() != null || sajuResult.getLuckyNumbers() != null) {
                StringBuilder lucky = new StringBuilder();
                if (sajuResult.getLuckyColors() != null && !sajuResult.getLuckyColors().isEmpty()) {
                    lucky.append("행운의 색상: ").append(String.join(", ", sajuResult.getLuckyColors())).append("\n");
                }
                if (sajuResult.getLuckyNumbers() != null && !sajuResult.getLuckyNumbers().isEmpty()) {
                    lucky.append("행운의 숫자: ");
                    lucky.append(sajuResult.getLuckyNumbers().stream()
                            .map(Object::toString)
                            .collect(java.util.stream.Collectors.joining(", ")));
                }
                if (lucky.length() > 0) {
                    addSection(document, font, "행운의 요소", lucky.toString());
                }
            }

            // 생성일시
            Paragraph footer = new Paragraph(
                    "생성일시: " + sajuResult.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .setFont(font)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(30);
            document.add(footer);

            document.close();
            log.info("PDF 생성 완료 - 크기: {} bytes", baos.size());

            return baos.toByteArray();

        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            throw new RuntimeException("PDF 생성 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    private void addSection(Document document, PdfFont font, String title, String content) {
        // 섹션 제목
        Paragraph sectionTitle = new Paragraph(title)
                .setFont(font)
                .setFontSize(16)
                .setBold()
                .setMarginTop(15)
                .setMarginBottom(5);
        document.add(sectionTitle);

        // 섹션 내용
        Paragraph sectionContent = new Paragraph(content)
                .setFont(font)
                .setFontSize(12)
                .setMarginBottom(10);
        document.add(sectionContent);
    }
}
