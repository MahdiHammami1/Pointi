package com.example.demo.responses;


import com.example.demo.dto.UserDTO;
import com.example.demo.entities.User;

public class LoginResponse {
    private String token;
    private long expiresIn;
    private String message;



    public LoginResponse() {}

    public LoginResponse(String token, long expiresIn, String message) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.message = message;
        this.user = user;


    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    private UserDTO user;

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}