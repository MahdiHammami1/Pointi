package com.example.demo.services;

import com.example.demo.dto.LoginUserDTO;
import com.example.demo.dto.RegisterUserDTO;
import com.example.demo.dto.VerifyUserDTO;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.responses.SignupResponse;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final JwtService jwtService;
    @Autowired
    private RoleRepository roleRepository;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    public SignupResponse signup(RegisterUserDTO input) {

        Role defaultRole = roleRepository.findByNom("ADMIN")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));
        try {
            // Basic validation
            if (userRepository.existsByEmail(input.getEmail())) {
                return new SignupResponse(
                        "Email already in use",
                        null,
                        null,
                        false
                );
            }

            if (userRepository.existsByUsername(input.getUsername())) {
                return new SignupResponse(
                        "Username already in use",
                        null,
                        null,
                        false
                );
            }

            // Generate 6-digit verification code
            String verificationCode = generateVerificationCode();

            // Create user
            User user = new User();
            user.setEmail(input.getEmail());
            user.setUsername(input.getUsername());
            user.setPassword(passwordEncoder.encode(input.getPassword()));
            user.setFirstName(input.getFirstName());
            user.setLastName(input.getLastName());
            user.setPhoneNumber(input.getPhoneNumber());
            user.setDateOfBirth(input.getDateOfBirth());
            user.setEnabled(false);
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));


            user.setRole(defaultRole); // Associe un rôle dès l’inscription

            User savedUser = userRepository.save(user);

            // Send verification email
            boolean emailSent = sendVerificationEmail(savedUser);

            if (!emailSent) {
                // If email fails, delete the created user
                userRepository.delete(savedUser);
                return new SignupResponse(
                        "Failed to send verification email",
                        null,
                        null,
                        false
                );
            }

            return new SignupResponse(
                    "Registration successful! Please check your email for verification code.",
                    savedUser.getEmail(),
                    savedUser.getUsername(),
                    true
            );
        } catch (Exception e) {
            return new SignupResponse(
                    "Registration failed: " + e.getMessage(),
                    null,
                    null,
                    false
            );
        }
    }

    private boolean sendVerificationEmail(User user) {
        try {
            String emailContent = String.format(
                    "Dear %s,\n\n" +
                            "Your verification code is: %s\n" +
                            "This code will expire in 15 minutes.\n\n" +
                            "Thank you!",
                    user.getFirstName(),
                    user.getVerificationCode()
            );

            emailService.sendVerificationEmail(
                    user.getEmail(),
                    "Your Verification Code",
                    emailContent
            );
            return true;
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", user.getEmail(), e);
            return false;
        }
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }
    public User authenticate(LoginUserDTO input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword())
        );

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return user;
    }

    public void verifyUser(VerifyUserDTO input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerified(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiry(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String username) {
        Optional<User> optionalUser = userRepository.findByEmail(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }








}
