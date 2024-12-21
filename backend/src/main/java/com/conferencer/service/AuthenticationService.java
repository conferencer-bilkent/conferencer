package com.conferencer.service;

import com.conferencer.model.LoginRequest;
import com.conferencer.model.LoginResponse;
import com.conferencer.model.SignupRequest;
import com.conferencer.model.SignupResponse;

public interface AuthenticationService {

    /**
     * Handles the authentication of a user based on login credentials.
     *
     * @param loginRequest Contains user credentials (username/email and password).
     * @return LoginResponse containing a JWT token and other relevant information.
     * @throws Exception if authentication fails.
     */
    LoginResponse login(LoginRequest loginRequest) ;

    /**
     * Handles the registration of a new user.
     *
     * @param signupRequest Contains the user's registration information.
     * @return SignupResponse with a success message and the newly created user's ID.
     * @throws Exception if there is an error (e.g., user already exists).
     */
    SignupResponse signup(SignupRequest signupRequest) ;
}