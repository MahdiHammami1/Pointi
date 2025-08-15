package com.example.demo.services;


import com.example.demo.dto.LoginUserDTO;
import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.dto.VerifyUserDTO;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.responses.SignupResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;


    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signup_shouldReturnErrorIfEmailExists() {
        RegisterUserDTO dto = new RegisterUserDTO();
        dto.setEmail("existing@example.com");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        SignupResponse response = authenticationService.signup(dto);

        assertFalse(response.isEmailSent());
        assertEquals("Email already in use", response.getMessage());
    }

    @Test
    void signup_shouldReturnErrorIfUsernameExists() {
        RegisterUserDTO dto = new RegisterUserDTO();
        dto.setEmail("new@example.com");
        dto.setUsername("existingUser");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("existingUser")).thenReturn(true);

        SignupResponse response = authenticationService.signup(dto);

        assertFalse(response.isEmailSent());
        assertEquals("Username already in use", response.getMessage());
    }

    @Test
    void authenticate_shouldThrowIfUserNotFound() {
        LoginUserDTO dto = new LoginUserDTO();
        dto.setEmail("notfound@example.com");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            authenticationService.authenticate(dto);
        });

        assertEquals("User not found", thrown.getMessage());
    }

    @Test
    void verifyUser_shouldEnableIfCodeIsCorrect() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setVerificationCode("123456");
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        VerifyUserDTO dto = new VerifyUserDTO();
        dto.setEmail("user@example.com");
        dto.setVerificationCode("123456");

        authenticationService.verifyUser(dto);

        assertTrue(user.isEnabled());
        assertTrue(user.isVerified());
        verify(userRepository).save(user);
    }

}
