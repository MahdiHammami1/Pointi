package com.example.demo.controllers;

import com.example.demo.dto.LoginUserDTO;
import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.responses.SignupResponse;
import com.example.demo.services.AuthenticationService;
import com.example.demo.services.JwtService;
import com.example.demo.services.RoleService;
import com.example.demo.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@AutoConfigureMockMvc

public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @BeforeEach
    void resetMocks() {
        Mockito.reset(authenticationService, jwtService, userService, roleService);
    }

    @Test
    void testSignupSuccess() throws Exception {
        RegisterUserDTO registerDto = new RegisterUserDTO();
        registerDto.setEmail("test@example.com");
        registerDto.setPassword("12345678");
        registerDto.setFirstName("Test");
        registerDto.setLastName("User");

        SignupResponse mockResponse = new SignupResponse("Created", null, "token-xyz", true);

        Mockito.when(authenticationService.signup(any(RegisterUserDTO.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isOk());
    }

    @Test
    void testLoginFail_UserNotFound() throws Exception {
        LoginUserDTO loginDto = new LoginUserDTO();
        loginDto.setEmail("notfound@example.com");
        loginDto.setPassword("password");

        Mockito.when(userService.findByEmail("notfound@example.com"))
                .thenReturn(java.util.Optional.empty());

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized());
    }

    @TestConfiguration
    static class MockConfig {
        @Bean
        public AuthenticationService authenticationService() {
            return Mockito.mock(AuthenticationService.class);
        }

        @Bean
        public JwtService jwtService() {
            return Mockito.mock(JwtService.class);
        }

        @Bean
        public UserService userService() {
            return Mockito.mock(UserService.class);
        }

        @Bean
        public RoleService roleService() {
            return Mockito.mock(RoleService.class);
        }
    }
}
