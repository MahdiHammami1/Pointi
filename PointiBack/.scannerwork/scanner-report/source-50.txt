package com.example.demo.services;

import com.example.demo.entities.Permission;
import com.example.demo.repositories.PermissionRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PermissionServiceTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private PermissionService permissionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createPermission_shouldSavePermission() {
        Permission p = new Permission();
        when(permissionRepository.save(p)).thenReturn(p);

        Permission result = permissionService.createPermission(p);

        assertEquals(p, result);
        verify(permissionRepository).save(p);
    }

    @Test
    void createPermissions_shouldSaveAll() {
        List<Permission> permissions = List.of(new Permission(), new Permission());
        when(permissionRepository.saveAll(permissions)).thenReturn(permissions);

        List<Permission> result = permissionService.createPermissions(permissions);

        assertEquals(2, result.size());
        verify(permissionRepository).saveAll(permissions);
    }

    @Test
    void getAllPermissions_shouldReturnList() {
        List<Permission> list = List.of(new Permission(), new Permission());
        when(permissionRepository.findAll()).thenReturn(list);

        List<Permission> result = permissionService.getAllPermissions();

        assertEquals(2, result.size());
    }

    @Test
    void getPermissionById_shouldReturnOptional() {
        UUID id = UUID.randomUUID();
        Permission p = new Permission();
        when(permissionRepository.findById(id)).thenReturn(Optional.of(p));

        Optional<Permission> result = permissionService.getPermissionById(id);

        assertTrue(result.isPresent());
        assertEquals(p, result.get());
    }

    @Test
    void updatePermission_shouldUpdateFields() {
        UUID id = UUID.randomUUID();
        Permission existing = new Permission();
        existing.setNom("Old");
        existing.setDescription("Old desc");

        Permission updated = new Permission();
        updated.setNom("New");
        updated.setDescription("New desc");

        when(permissionRepository.findById(id)).thenReturn(Optional.of(existing));
        when(permissionRepository.save(existing)).thenReturn(existing);

        Permission result = permissionService.updatePermission(id, updated);

        assertEquals("New", result.getNom());
        assertEquals("New desc", result.getDescription());
        verify(permissionRepository).save(existing);
    }

    @Test
    void updatePermission_shouldReturnNullIfNotFound() {
        UUID id = UUID.randomUUID();
        when(permissionRepository.findById(id)).thenReturn(Optional.empty());

        Permission result = permissionService.updatePermission(id, new Permission());

        assertNull(result);
    }

    @Test
    void deletePermission_shouldCallRepository() {
        UUID id = UUID.randomUUID();

        permissionService.deletePermission(id);

        verify(permissionRepository).deleteById(id);
    }

    @Test
    void deleteAllPermissions_shouldRunNativeQuery() {
        var queryMock = mock(jakarta.persistence.Query.class);
        when(entityManager.createNativeQuery(anyString())).thenReturn(queryMock);

        permissionService.deleteAllPermissions();

        verify(entityManager).createNativeQuery("DELETE FROM role_permissions");
        verify(queryMock).executeUpdate();
        verify(permissionRepository).deleteAll();
    }
}
