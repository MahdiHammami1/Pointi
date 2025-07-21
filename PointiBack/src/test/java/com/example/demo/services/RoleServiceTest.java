package com.example.demo.services;

import com.example.demo.entities.Permission;
import com.example.demo.entities.Role;
import com.example.demo.repositories.PermissionRepository;
import com.example.demo.repositories.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @InjectMocks
    private RoleService roleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createRole_shouldSaveRole() {
        Role role = new Role();
        when(roleRepository.save(role)).thenReturn(role);

        Role result = roleService.createRole(role);

        assertEquals(role, result);
    }

    @Test
    void getRoleById_shouldReturnOptionalRole() {
        UUID id = UUID.randomUUID();
        Role role = new Role();
        when(roleRepository.findById(id)).thenReturn(Optional.of(role));

        Optional<Role> result = roleService.getRoleById(id);

        assertTrue(result.isPresent());
        assertEquals(role, result.get());
    }

    @Test
    void updateRole_shouldUpdateNomAndPermissions() {
        UUID id = UUID.randomUUID();
        Role oldRole = new Role();
        Role updated = new Role();
        updated.setNom("ADMIN");
        updated.setPermissions(Set.of(new Permission()));

        when(roleRepository.findById(id)).thenReturn(Optional.of(oldRole));
        when(roleRepository.save(oldRole)).thenReturn(oldRole);

        Role result = roleService.updateRole(id, updated);

        assertEquals("ADMIN", result.getNom());
        assertEquals(1, result.getPermissions().size());
    }

    @Test
    void addPermissionToRole_shouldAddAndSave() {
        UUID roleId = UUID.randomUUID();
        UUID permissionId = UUID.randomUUID();

        Role role = new Role();
        role.setPermissions(new HashSet<>());

        Permission permission = new Permission();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));
        when(roleRepository.save(role)).thenReturn(role);

        Role result = roleService.addPermissionToRole(roleId, permissionId);

        assertTrue(result.getPermissions().contains(permission));
    }

    @Test
    void addPermissionToRoleByName_shouldAddIfPermissionFound() {
        UUID roleId = UUID.randomUUID();
        String permissionName = "READ";

        Role role = new Role();
        role.setPermissions(new HashSet<>());

        Permission permission = new Permission();
        permission.setNom(permissionName);

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findByNom(permissionName)).thenReturn(Optional.of(permission));
        when(roleRepository.save(role)).thenReturn(role);

        Role result = roleService.addPermissionToRoleByName(roleId, permissionName);

        assertTrue(result.getPermissions().contains(permission));
    }

    @Test
    void removePermissionFromRoleByName_shouldRemoveSuccessfully() {
        UUID roleId = UUID.randomUUID();
        String permissionName = "WRITE";

        Permission permission = new Permission();
        permission.setNom(permissionName);

        Role role = new Role();
        role.setPermissions(new HashSet<>(Set.of(permission)));

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findByNom(permissionName)).thenReturn(Optional.of(permission));
        when(roleRepository.save(role)).thenReturn(role);

        Role result = roleService.removePermissionFromRoleByName(roleId, permissionName);

        assertFalse(result.getPermissions().contains(permission));
    }

    @Test
    void getRolePermissions_shouldReturnPermissions() {
        UUID roleId = UUID.randomUUID();
        Permission permission = new Permission();
        Set<Permission> permissionSet = new HashSet<>(Set.of(permission));
        Role role = new Role();
        role.setPermissions(permissionSet);

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        Optional<Set<Permission>> result = roleService.getRolePermissions(roleId);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().size());
    }

    @Test
    void addRolePermissions_shouldReplacePermissions() {
        UUID roleId = UUID.randomUUID();
        UUID permissionId1 = UUID.randomUUID();
        UUID permissionId2 = UUID.randomUUID();

        Role role = new Role();
        role.setPermissions(new HashSet<>());

        Permission p1 = new Permission();
        Permission p2 = new Permission();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findAllById(List.of(permissionId1, permissionId2))).thenReturn(List.of(p1, p2));

        roleService.addRolePermissions(roleId, List.of(permissionId1, permissionId2));

        verify(roleRepository).save(role);
        assertEquals(2, role.getPermissions().size());
    }
}
