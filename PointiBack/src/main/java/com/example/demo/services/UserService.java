package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private RoleRepository roleRepository;

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
            user.setRole(updatedUser.getRole());
            user.setProfilePicture(updatedUser.getProfilePicture());
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setDateOfBirth(updatedUser.getDateOfBirth());
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

    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    public User setRoleToUser(UUID userId, UUID roleID) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role existingRole = roleRepository.findById(roleID)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(existingRole);
        return userRepository.save(user);
    }

    public User modifyRoleOfUser(UUID userId, UUID roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role newRole = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(newRole);
        return userRepository.save(user);
    }

    public User deleteRoleOfUser(UUID userId, UUID roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Vérifie que le rôle de l'utilisateur correspond à celui à supprimer
        if (user.getRole() != null && user.getRole().getId().equals(role.getId())) {
            user.setRole(null);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User does not have the specified role");
        }
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public String getUsrRole(UUID id) {
        return userRepository.findById(id)
                .map(User::getRole)
                .map(Role::getNom)
                .orElse(null);
    }

}
