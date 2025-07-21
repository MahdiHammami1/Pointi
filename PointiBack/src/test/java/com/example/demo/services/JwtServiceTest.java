package com.example.demo.services;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        // Inject manually the secretKey and expiration time
        // secret: "test_secret_key" (Base64)
        SecretKey base64Key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // = "test_secret_key"
        long expiration = 3600000; // 1h

        injectPrivateField(jwtService, "secretKey", base64Key);
        injectPrivateField(jwtService, "jwtExpiration", expiration);
    }

    private void injectPrivateField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to inject field: " + fieldName, e);
        }
    }

    @Test
    void generateAndValidateToken() {
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .roles("USER")
                .build();

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, userDetails));
        assertEquals("test@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.getExpirationTime() > 0);

        Date expiration = jwtService.extractExpiration(token);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void tokenShouldBeInvalidIfUsernameDiffers() {
        UserDetails correctUser = User.withUsername("a@a.com").password("123").roles("USER").build();
        UserDetails otherUser = User.withUsername("b@b.com").password("123").roles("USER").build();

        String token = jwtService.generateToken(correctUser);

        assertFalse(jwtService.isTokenValid(token, otherUser));
    }
}
