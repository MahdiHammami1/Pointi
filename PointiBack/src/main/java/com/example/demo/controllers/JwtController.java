package com.example.demo.controllers;

import com.example.demo.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @GetMapping("/token")
    public ResponseEntity<String> getJwtToken() {
        // Simulate a test user
        User dummyUser = new User(
                "debuguser@example.com",  // username
                "password",               // password (not used here)
                Collections.emptyList()  // authorities
        );

        // Generate the token
        String token = jwtService.generateToken(dummyUser);

        // Return it
        return ResponseEntity.ok(token);
    }
}
