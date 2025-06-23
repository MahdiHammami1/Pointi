package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String username;

    private String email;

    private LocalDate dateOfBirth;


    @Column(nullable = false)
    private String password;

    private LocalDateTime lastLogin;
    private String verificationCode;
    private LocalDateTime verificationCodeExpiry;

    private boolean enabled;
    private boolean verified;

    @OneToOne
    @JoinColumn(name = "role_id")
    private Role role;

    // === Implémentation des méthodes UserDetails ===

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retourner les rôles ou permissions ici
        return Collections.emptyList(); // à remplacer si vous avez des rôles/permissions
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // ou false selon votre logique métier
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // idem
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // idem
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
