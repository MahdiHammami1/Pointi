package com.example.demo.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupResponse {
    private String message;
    private String email;
    private String username;
    private boolean emailSent;
}