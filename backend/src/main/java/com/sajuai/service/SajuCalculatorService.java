package com.sajuai.service;

import com.sajuai.model.BirthData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 전통 사주팔자 계산 서비스
 * 천간지지를 이용한 년주, 월주, 일주, 시주 계산
 */
@Service
@Slf4j
public class SajuCalculatorService {

    // 천간 (天干) - 10개
    private static final String[] HEAVENLY_STEMS = {
        "갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)",
        "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"
    };

    // 지지 (地支) - 12개
    private static final String[] EARTHLY_BRANCHES = {
        "자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)",
        "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"
    };

    // 오행 (五行)
    private static final Map<String, String> ELEMENT_MAP = new HashMap<>();

    static {
        ELEMENT_MAP.put("갑(甲)", "목(木)");
        ELEMENT_MAP.put("을(乙)", "목(木)");
        ELEMENT_MAP.put("병(丙)", "화(火)");
        ELEMENT_MAP.put("정(丁)", "화(火)");
        ELEMENT_MAP.put("무(戊)", "토(土)");
        ELEMENT_MAP.put("기(己)", "토(土)");
        ELEMENT_MAP.put("경(庚)", "금(金)");
        ELEMENT_MAP.put("신(辛)", "금(金)");
        ELEMENT_MAP.put("임(壬)", "수(水)");
        ELEMENT_MAP.put("계(癸)", "수(水)");
    }

    /**
     * 사주팔자 계산 메인 메서드
     *
     * @param birthData 생년월일시 정보
     * @return 년주, 월주, 일주, 시주가 담긴 Map
     */
    public Map<String, String> calculateFourPillars(BirthData birthData) {
        log.debug("사주 계산 시작: {}-{}-{} {}:{}",
                birthData.getYear(), birthData.getMonth(), birthData.getDay(),
                birthData.getHour(), birthData.getMinute());

        Map<String, String> pillars = new HashMap<>();

        // 년주 계산
        String yearPillar = calculateYearPillar(birthData.getYear());
        pillars.put("yearPillar", yearPillar + " " + getElement(yearPillar.substring(0, 3)));

        // 월주 계산
        String monthPillar = calculateMonthPillar(birthData.getYear(), birthData.getMonth());
        pillars.put("monthPillar", monthPillar + " " + getElement(monthPillar.substring(0, 3)));

        // 일주 계산
        LocalDate date = LocalDate.of(birthData.getYear(), birthData.getMonth(), birthData.getDay());
        String dayPillar = calculateDayPillar(date);
        pillars.put("dayPillar", dayPillar + " " + getElement(dayPillar.substring(0, 3)));

        // 시주 계산
        String hourPillar = calculateHourPillar(dayPillar, birthData.getHour());
        pillars.put("hourPillar", hourPillar + " " + getElement(hourPillar.substring(0, 3)));

        log.debug("사주 계산 완료: {}", pillars);
        return pillars;
    }

    /**
     * 년주 계산
     * 육십갑자를 이용한 년주 계산
     *
     * @param year 년도
     * @return 년주 (예: 경자(庚子))
     */
    private String calculateYearPillar(int year) {
        // 기준년도 1984년 = 갑자(甲子)년
        int baseYear = 1984;
        int offset = year - baseYear;

        // 육십갑자 순환 (60년 주기)
        int index = offset % 60;
        if (index < 0) index += 60;

        int stemIndex = index % 10;
        int branchIndex = index % 12;

        return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
    }

    /**
     * 월주 계산
     * 년간과 월을 이용한 월주 계산
     *
     * @param year 년도
     * @param month 월
     * @return 월주
     */
    private String calculateMonthPillar(int year, int month) {
        // 년간 구하기
        int yearOffset = (year - 1984) % 60;
        if (yearOffset < 0) yearOffset += 60;
        int yearStem = yearOffset % 10;

        // 월주 천간 계산 (년간에 따라 정해진 월간 공식)
        int monthStemBase = (yearStem % 5) * 2;
        int monthStem = (monthStemBase + month - 1) % 10;

        // 월주 지지 계산 (1월=인(寅), 2월=묘(卯), ...)
        // 입춘 기준이나 간단히 월 기준으로 계산
        int monthBranch = (month + 1) % 12;

        return HEAVENLY_STEMS[monthStem] + EARTHLY_BRANCHES[monthBranch];
    }

    /**
     * 일주 계산
     * 율리우스력 기준 계산
     *
     * @param date 날짜
     * @return 일주
     */
    private String calculateDayPillar(LocalDate date) {
        long julianDay = calculateJulianDay(date);

        // 육십갑자 순환
        int index = (int) ((julianDay + 49) % 60);
        if (index < 0) index += 60;

        int stemIndex = index % 10;
        int branchIndex = index % 12;

        return HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
    }

    /**
     * 시주 계산
     * 일간과 시간으로 계산
     *
     * @param dayPillar 일주
     * @param hour 시
     * @return 시주
     */
    private String calculateHourPillar(String dayPillar, int hour) {
        // 일간 추출
        String dayStem = dayPillar.substring(0, 3);
        int dayStemIndex = -1;
        for (int i = 0; i < HEAVENLY_STEMS.length; i++) {
            if (HEAVENLY_STEMS[i].equals(dayStem)) {
                dayStemIndex = i;
                break;
            }
        }

        // 시간을 지지로 변환 (23-01시: 자, 01-03시: 축, ...)
        int hourBranchIndex = ((hour + 1) / 2) % 12;

        // 시주 천간 계산 (일간에 따라 정해진 시간 공식)
        int hourStemBase = (dayStemIndex % 5) * 2;
        int hourStemIndex = (hourStemBase + hourBranchIndex) % 10;

        return HEAVENLY_STEMS[hourStemIndex] + EARTHLY_BRANCHES[hourBranchIndex];
    }

    /**
     * 율리우스일 계산
     *
     * @param date 날짜
     * @return 율리우스일
     */
    private long calculateJulianDay(LocalDate date) {
        int year = date.getYear();
        int month = date.getMonthValue();
        int day = date.getDayOfMonth();

        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        int a = year / 100;
        int b = 2 - a + (a / 4);

        return (long) (Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1)) +
                day + b - 1524.5);
    }

    /**
     * 천간의 오행 반환
     *
     * @param stem 천간
     * @return 오행
     */
    private String getElement(String stem) {
        return ELEMENT_MAP.getOrDefault(stem, "");
    }
}
