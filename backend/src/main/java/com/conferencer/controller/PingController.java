package com.conferencer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {
    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }
}
