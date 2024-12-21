package com.conferencer.service.impl;

import com.conferencer.model.User;
import com.conferencer.repository.UserRepository;
import com.conferencer.service.AuthenticationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.conferencer.model.LoginRequest;
import com.conferencer.model.LoginResponse;
import com.conferencer.model.SignupRequest;
import com.conferencer.model.SignupResponse;

import java.util.Optional;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.time.OffsetDateTime;

import com.conferencer.exception.InvalidCredentialsException;
import com.conferencer.exception.ServiceException;
import com.conferencer.model.bean.ErrorTypeEnum;


@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    public AuthenticationServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest)  {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        if (!optionalUser.isPresent()) {
            throw new ServiceException(ErrorTypeEnum.INVALID_CREDENTIALS);
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ServiceException(ErrorTypeEnum.INVALID_CREDENTIALS);
        }

        String jwtSecret = "yourSecretKey"; 
        OffsetDateTime expiresAt = OffsetDateTime.now().plusDays(1);
        long expirationTime = 86400000; 

        String token = Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setMessage("Login successful.");
        loginResponse.setToken(token);
        loginResponse.setExpiresAt(expiresAt);

        return loginResponse;
    }


    @Override
    public SignupResponse signup(SignupRequest signupRequest) {
        Optional<User> existingUser = userRepository.findByEmail(signupRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new ServiceException(ErrorTypeEnum.USER_ALREADY_EXIST);
        }

        // Create a new User entity
        User user = new User();
        user.setName(signupRequest.getName());
        user.setSurname(signupRequest.getSurname());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));  // Only encode once

        // Save the user and return the response
        User savedUser = userRepository.save(user); // this always gives error somehow
        // Print the details of the saved user
        System.out.println("User saved successfully:");
        System.out.println("ID: " + savedUser.getRowId());
        System.out.println("Name: " + savedUser.getName());
        System.out.println("Surname: " + savedUser.getSurname());
        System.out.println("Email: " + savedUser.getEmail());
        // Prepare response
        SignupResponse signupResponse = new SignupResponse();
        signupResponse.setUserId(savedUser.getRowId());
        signupResponse.setMessage("User registered successfully.");
        return signupResponse;
    
    }
       
}