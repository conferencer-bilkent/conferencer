package com.conferencer.service;

import com.conferencer.model.User;
import com.conferencer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface AuthService {


    @Autowired
    public User signup(User user);
    public User login(String email, String password);
}