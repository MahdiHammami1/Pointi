package com.example.demo.controllers;

import com.example.demo.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @GetMapping("/token")
    public ResponseEntity<String> getJwtToken() {
        // Username à simuler (debug uniquement)
        String username = "debuguser@example.com";

        // Génère un token directement à partir du nom d'utilisateur
        String token = jwtService.generateTokenFromUsername(username);

        return ResponseEntity.ok(token);
    }
}
