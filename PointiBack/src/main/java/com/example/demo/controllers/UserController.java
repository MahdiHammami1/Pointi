package com.example.demo.controllers;

import com.example.demo.dto.UserDTO;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/addAll")
    public List<User> createUsers(@RequestBody List<User> users) {
        return userService.createUsers(users);
    }

    @GetMapping("")
    public Page<User> getAllUsers(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

    @DeleteMapping("/all")
    public void deleteAllUsers() {
        userService.deleteAllUsers();
    }

    @PutMapping("/set-role")
    public User setRoleToUser(@RequestParam UUID userId, @RequestParam UUID roleId) {
        return userService.setRoleToUser(userId, roleId);
    }


    @PutMapping("/{userId}/modify-role/{roleId}")
    public User modifyRoleOfUser(@PathVariable UUID userId, @PathVariable UUID roleId) {
        return userService.modifyRoleOfUser(userId, roleId);
    }

    @DeleteMapping("/role")
    public ResponseEntity<User> deleteUserRole(
            @RequestParam UUID userId,
            @RequestParam UUID roleId) {

        User updatedUser = userService.deleteRoleOfUser(userId, roleId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(convertToDTO(user));
    }

    @GetMapping("/getRole/{id}")
    public ResponseEntity<String> getUserRole(@PathVariable UUID id) {
        String role = userService.getUsrRole(id);
        if (role != null) {
            return ResponseEntity.ok(role);
        } else {
            return ResponseEntity.notFound().build(); // 404 si utilisateur non trouvé ou pas de rôle
        }
    }

    public UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getUsername(),
                user.getPhoneNumber(),
                user.getDateOfBirth(),
                user.getLastLogin(),
                user.getCreatedAt(),
                user.getModifiedAt(),
                user.getRole() //
        );
    }




}
