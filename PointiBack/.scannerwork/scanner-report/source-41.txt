package com.example.demo.services;

import com.example.demo.entities.Permission;
import com.example.demo.repositories.PermissionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Permission createPermission(Permission permission) {
        return permissionRepository.save(permission);
    }

    public List<Permission> createPermissions(List<Permission> permissions) {
        return permissionRepository.saveAll(permissions);
    }
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Optional<Permission> getPermissionById(UUID id) {
        return permissionRepository.findById(id);
    }

    public Permission updatePermission(UUID id, Permission updatedPermission) {
        return permissionRepository.findById(id).map(permission -> {
            permission.setNom(updatedPermission.getNom());
            permission.setDescription(updatedPermission.getDescription());
            return permissionRepository.save(permission);
        }).orElse(null);
    }

    public void deletePermission(UUID id) {
        permissionRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllPermissions() {
        entityManager.createNativeQuery("DELETE FROM role_permissions").executeUpdate();
        permissionRepository.deleteAll();
    }

}
