package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleService roleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createUser_shouldSaveUser() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.createUser(user);

        assertEquals(user, result);
    }

    @Test
    void getUserById_shouldReturnUserIfExists() {
        UUID id = UUID.randomUUID();
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(id);

        assertTrue(result.isPresent());
        assertEquals(user, result.get());
    }

    @Test
    void updateUser_shouldUpdateUserFields() {
        UUID id = UUID.randomUUID();
        User existing = new User();
        existing.setUsername("old");
        existing.setEmail("old@mail.com");
        existing.setFirstName("Old");
        existing.setDateOfBirth(LocalDate.of(2000, 1, 1));

        User updated = new User();
        updated.setUsername("new@mail.com");
        updated.setEmail("new@mail.com");
        updated.setFirstName("New");
        updated.setDateOfBirth(LocalDate.now());

        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(existing)).thenReturn(existing);

        User result = userService.updateUser(id, updated);

        assertNotNull(result);
        assertEquals("new@mail.com", result.getUsername());
        assertEquals("new@mail.com", result.getEmail());
        assertEquals("New", result.getFirstName());
    }

    @Test
    void deleteUser_shouldCallRepository() {
        UUID id = UUID.randomUUID();
        userService.deleteUser(id);
        verify(userRepository).deleteById(id);
    }

    @Test
    void findByEmail_shouldReturnUser() {
        String email = "user@example.com";
        User user = new User();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(user, result.get());
    }

    @Test
    void setRoleToUser_shouldAssignRole() {
        UUID uid = UUID.randomUUID();
        UUID rid = UUID.randomUUID();
        User user = new User();
        Role role = new Role();

        when(userRepository.findById(uid)).thenReturn(Optional.of(user));
        when(roleService.getRoleById(rid)).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.setRoleToUser(uid, rid);

        assertEquals(role, result.getRole());
        verify(userRepository).save(user);
    }

    @Test
    void deleteRoleOfUser_shouldThrowIfRoleDoesNotMatch() {
        UUID uid = UUID.randomUUID();
        UUID rid = UUID.randomUUID();
        Role assigned = new Role();
        assigned.setId(UUID.randomUUID());
        User user = new User();
        user.setRole(assigned);

        Role toRemove = new Role();
        toRemove.setId(rid);

        when(userRepository.findById(uid)).thenReturn(Optional.of(user));
        when(roleService.getRoleById(rid)).thenReturn(Optional.of(toRemove));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.deleteRoleOfUser(uid, rid));
        assertEquals("User does not have the specified role", ex.getMessage());
    }

    @Test
    void deleteRoleOfUser_shouldRemoveRoleIfMatch() {
        UUID uid = UUID.randomUUID();
        UUID rid = UUID.randomUUID();
        Role role = new Role();
        role.setId(rid);
        User user = new User();
        user.setRole(role);

        when(userRepository.findById(uid)).thenReturn(Optional.of(user));
        when(roleService.getRoleById(rid)).thenReturn(Optional.of(role));
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.deleteRoleOfUser(uid, rid);

        assertNull(result.getRole());
    }

    @Test
    void getUsrRole_shouldReturnRoleName() {
        UUID uid = UUID.randomUUID();
        Role role = new Role();
        role.setNom("ADMIN");
        User user = new User();
        user.setRole(role);

        when(userRepository.findById(uid)).thenReturn(Optional.of(user));

        String name = userService.getUsrRole(uid);
        assertEquals("ADMIN", name);
    }

    @Test
    void createUsers_shouldSaveAll() {
        List<User> list = List.of(new User(), new User());
        when(userRepository.saveAll(list)).thenReturn(list);

        List<User> result = userService.createUsers(list);
        assertEquals(2, result.size());
        verify(userRepository).saveAll(list);
    }
}
