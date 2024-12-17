package com.conferencer.controller;

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

@RestController
public class AuthenticationController implements AuthenticationApi {

    private final AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        // Logic for user login
        try {
            // Assuming authenticationService handles the logic for authentication
            LoginResponse loginResponse = authenticationService.login(loginRequest);

            // If successful, return the response with status 200
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        } catch (Exception e) {
            // Handle exception and return error response
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public ResponseEntity<SignupResponse> signup(SignupRequest signupRequest) {
        // Logic for user signup
        try {
            // Assuming authenticationService handles the signup logic
            SignupResponse signupResponse = authenticationService.signup(signupRequest);
            // If successful, return the response with status 201
            return new ResponseEntity<>(signupResponse, HttpStatus.CREATED);
        } catch (Exception e) {
            // Handle exception, such as user already exists or invalid input
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}