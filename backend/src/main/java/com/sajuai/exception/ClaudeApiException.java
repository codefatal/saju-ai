package com.sajuai.exception;

/**
 * Claude API 호출 중 발생하는 예외
 */
public class ClaudeApiException extends RuntimeException {

    public ClaudeApiException(String message) {
        super(message);
    }

    public ClaudeApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
