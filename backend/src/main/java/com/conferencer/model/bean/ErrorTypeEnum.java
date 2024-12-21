/*
 * Copyright 2024 Commencis Backend Camp. All Rights Reserved.
 */

package com.conferencer.model.bean;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ErrorTypeEnum {
    NOT_IMPLEMENTED("be00000", "Not implemented.", HttpStatus.NO_CONTENT),
    ERROR_GENERAL("be00001", "General error.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_CREDENTIALS("be00002", "Email or password is incorrent.", HttpStatus.UNAUTHORIZED),
    USER_ALREADY_EXIST("be00003", "User with that mail already exists.", HttpStatus.CONFLICT),;
    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
