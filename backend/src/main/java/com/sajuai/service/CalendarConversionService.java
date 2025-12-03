package com.sajuai.service;

import com.sajuai.dto.CalendarConversionRequest;
import com.sajuai.dto.CalendarConversionResponse;
import com.github.usingsky.calendar.KoreanLunarCalendar;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class CalendarConversionService {

    private static final String[] CHEON_GAN = {"갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"};
    private static final String[] JI_JI = {"자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"};
    private static final Map<DayOfWeek, String> WEEK_DAY_MAP = new HashMap<>();

    static {
        WEEK_DAY_MAP.put(DayOfWeek.MONDAY, "월요일");
        WEEK_DAY_MAP.put(DayOfWeek.TUESDAY, "화요일");
        WEEK_DAY_MAP.put(DayOfWeek.WEDNESDAY, "수요일");
        WEEK_DAY_MAP.put(DayOfWeek.THURSDAY, "목요일");
        WEEK_DAY_MAP.put(DayOfWeek.FRIDAY, "금요일");
        WEEK_DAY_MAP.put(DayOfWeek.SATURDAY, "토요일");
        WEEK_DAY_MAP.put(DayOfWeek.SUNDAY, "일요일");
    }

    public CalendarConversionResponse convertCalendar(CalendarConversionRequest request) {
        try {
            CalendarConversionResponse.CalendarConversionResponseBuilder responseBuilder = CalendarConversionResponse.builder()
                    .inputYear(request.getYear())
                    .inputMonth(request.getMonth())
                    .inputDay(request.getDay())
                    .inputIsLunar(request.getIsLunar())
                    .inputIsLeapMonth(request.getIsLeapMonth() != null ? request.getIsLeapMonth() : false);

            LocalDate solarDate;

            if (request.getIsLunar()) {
                // 음력 → 양력 변환
                KoreanLunarCalendar calendar = KoreanLunarCalendar.getInstance();
                calendar.setLunarDate(
                        request.getYear(),
                        request.getMonth(),
                        request.getDay(),
                        request.getIsLeapMonth() != null && request.getIsLeapMonth()
                );

                String[] solarDateParts = calendar.getSolarIsoFormat().split("-");
                int solarYear = Integer.parseInt(solarDateParts[0]);
                int solarMonth = Integer.parseInt(solarDateParts[1]);
                int solarDay = Integer.parseInt(solarDateParts[2]);

                solarDate = LocalDate.of(solarYear, solarMonth, solarDay);

                responseBuilder
                        .convertedYear(solarYear)
                        .convertedMonth(solarMonth)
                        .convertedDay(solarDay)
                        .convertedIsLunar(false)
                        .convertedIsLeapMonth(false);

                String leapInfo = request.getIsLeapMonth() != null && request.getIsLeapMonth() ? " (윤달)" : "";
                responseBuilder
                        .inputDateString(String.format("음력 %d년 %d월 %d일%s",
                                request.getYear(), request.getMonth(), request.getDay(), leapInfo))
                        .convertedDateString(String.format("양력 %d년 %d월 %d일",
                                solarYear, solarMonth, solarDay));

            } else {
                // 양력 → 음력 변환
                solarDate = LocalDate.of(request.getYear(), request.getMonth(), request.getDay());

                KoreanLunarCalendar calendar = KoreanLunarCalendar.getInstance();
                calendar.setSolarDate(request.getYear(), request.getMonth(), request.getDay());

                String lunarFormat = calendar.getLunarIsoFormat();
                String[] lunarDateParts = lunarFormat.split("-");
                int lunarYear = Integer.parseInt(lunarDateParts[0]);
                int lunarMonth = Integer.parseInt(lunarDateParts[1]);
                int lunarDay = Integer.parseInt(lunarDateParts[2]);
                // 윤달 정보는 기본값 false 사용 (라이브러리 제약)
                boolean isLeapMonth = false;

                responseBuilder
                        .convertedYear(lunarYear)
                        .convertedMonth(lunarMonth)
                        .convertedDay(lunarDay)
                        .convertedIsLunar(true)
                        .convertedIsLeapMonth(isLeapMonth);

                String leapInfo = isLeapMonth ? " (윤달)" : "";
                responseBuilder
                        .inputDateString(String.format("양력 %d년 %d월 %d일",
                                request.getYear(), request.getMonth(), request.getDay()))
                        .convertedDateString(String.format("음력 %d년 %d월 %d일%s",
                                lunarYear, lunarMonth, lunarDay, leapInfo));
            }

            // 요일 정보 추가
            responseBuilder.weekDay(WEEK_DAY_MAP.get(solarDate.getDayOfWeek()));

            // 간지 정보 추가
            String ganzi = calculateGanzi(solarDate);
            responseBuilder.ganzi(ganzi);

            log.info("Calendar conversion completed: {} → {}",
                    responseBuilder.build().getInputDateString(),
                    responseBuilder.build().getConvertedDateString());

            return responseBuilder.build();

        } catch (Exception e) {
            log.error("Calendar conversion failed: {}", e.getMessage(), e);
            throw new RuntimeException("날짜 변환에 실패했습니다: " + e.getMessage());
        }
    }

    private String calculateGanzi(LocalDate date) {
        int year = date.getYear();
        int month = date.getMonthValue();
        int day = date.getDayOfMonth();

        // 년간지 계산 (기준: 1984년 = 갑자년)
        int yearOffset = (year - 1984) % 60;
        if (yearOffset < 0) yearOffset += 60;
        String yearGan = CHEON_GAN[yearOffset % 10];
        String yearJi = JI_JI[yearOffset % 12];

        // 월간지 계산 (대략적인 계산)
        int monthOffset = ((year - 1984) * 12 + (month - 1)) % 60;
        if (monthOffset < 0) monthOffset += 60;
        String monthGan = CHEON_GAN[monthOffset % 10];
        String monthJi = JI_JI[monthOffset % 12];

        // 일간지 계산 (율리우스력 기준)
        long julianDay = toJulianDay(year, month, day);
        int dayOffset = (int) ((julianDay - 2447166) % 60); // 1988-02-05 = 갑자일
        if (dayOffset < 0) dayOffset += 60;
        String dayGan = CHEON_GAN[dayOffset % 10];
        String dayJi = JI_JI[dayOffset % 12];

        return String.format("%s%s년 %s%s월 %s%s일",
                yearGan, yearJi, monthGan, monthJi, dayGan, dayJi);
    }

    private long toJulianDay(int year, int month, int day) {
        int a = (14 - month) / 12;
        int y = year + 4800 - a;
        int m = month + 12 * a - 3;
        return day + (153 * m + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 32045;
    }
}
