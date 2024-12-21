package com.conferencer.exception;

import org.springframework.http.HttpStatus;

import com.conferencer.model.bean.ErrorTypeEnum;

import lombok.Getter;

@Getter
public class ServiceException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final String errorCode;
    private final String errorMessage;

    public ServiceException(final ErrorTypeEnum errorTypeEnum) {
        super(errorTypeEnum.name());
        this.httpStatus = errorTypeEnum.getHttpStatus();
        this.errorCode = errorTypeEnum.getCode();
        this.errorMessage = errorTypeEnum.getMessage();
    }

}
