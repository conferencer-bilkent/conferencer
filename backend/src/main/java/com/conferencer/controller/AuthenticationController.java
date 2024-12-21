package com.conferencer.controller;

import java.time.LocalDateTime;


import com.conferencer.api.AuthenticationApi;
import com.conferencer.model.LoginRequest;
import com.conferencer.model.LoginResponse;
import com.conferencer.model.SignupRequest;
import com.conferencer.model.SignupResponse;
import com.conferencer.service.AuthenticationService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.conferencer.exception.ServiceException;

import com.conferencer.model.bean.ErrorResponse;

@RestController
public class AuthenticationController implements AuthenticationApi {

    private final AuthenticationService authenticationService;

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(final ServiceException ex) {
        final ErrorResponse errorResponse = new ErrorResponse(LocalDateTime.now().toString(),
                ex.getErrorMessage(),ex.getErrorCode());
        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }


    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        LoginResponse loginResponse = authenticationService.login(loginRequest);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<SignupResponse> signup(SignupRequest signupRequest) {
        SignupResponse signupResponse = authenticationService.signup(signupRequest);
        return new ResponseEntity<>(signupResponse, HttpStatus.CREATED);
    }
}