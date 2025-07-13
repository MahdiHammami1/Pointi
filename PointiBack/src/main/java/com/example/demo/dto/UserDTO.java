package com.example.demo.dto;

import com.example.demo.entities.Role;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private Role role;


    public UserDTO(UUID id, String firstName, String lastName, String email,
                   String username, String phoneNumber, LocalDate dateOfBirth,
                   LocalDateTime lastLogin, LocalDateTime createdAt, LocalDateTime modifiedAt, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.lastLogin = lastLogin;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.role = role;
    }

    // Getters & setters ici
}
