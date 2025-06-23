package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {


    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User updateUser(UUID id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setPassword(updatedUser.getPassword());
            user.setLastLogin(updatedUser.getLastLogin());
            user.setVerificationCode(updatedUser.getVerificationCode());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        }).orElse(null);
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email) ;
        return user ;
    }
}
