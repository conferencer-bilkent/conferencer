package com.conferencer.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.conferencer.model.bean.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(final InvalidCredentialsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(LocalDateTime.now().toString(), "", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(final ServiceException ex) {
        final ErrorResponse errorResponse = new ErrorResponse(LocalDateTime.now().toString(),
                ex.getErrorMessage(),ex.getErrorCode());
        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }
}
