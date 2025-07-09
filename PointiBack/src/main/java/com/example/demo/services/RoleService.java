package com.example.demo.services;

import com.example.demo.entities.Permission;
import com.example.demo.entities.Role;
import com.example.demo.repositories.PermissionRepository;
import com.example.demo.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(UUID id) {
        return roleRepository.findById(id);
    }

    public Role updateRole(UUID id, Role updatedRole) {
        return roleRepository.findById(id).map(role -> {
            role.setNom(updatedRole.getNom());
            role.setPermissions(updatedRole.getPermissions());
            return roleRepository.save(role);
        }).orElse(null);
    }

    public void deleteRole(UUID id) {
        roleRepository.deleteById(id);
    }

    // ✅ Add permission by ID
    public Role addPermissionToRole(UUID roleId, UUID permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().add(permission);
        return roleRepository.save(role);
    }

    // ✅ Add permission by name
    public Role addPermissionToRoleByName(UUID roleId, String permissionName) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Permission permission = permissionRepository.findByNom(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().add(permission);
        return roleRepository.save(role);
    }

    // ✅ Remove permission by name
    public Role removePermissionFromRoleByName(UUID roleId, String permissionName) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Permission permission = permissionRepository.findByNom(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        boolean removed = role.getPermissions().remove(permission);
        if (!removed) {
            throw new RuntimeException("Permission not associated with this role.");
        }

        return roleRepository.save(role);
    }

    // ✅ Remove permission by ID
    public Role removePermissionFromRole(UUID roleId, UUID permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        role.getPermissions().remove(permission);
        return roleRepository.save(role);
    }

    public Optional<Set<Permission>> getRolePermissions(UUID roleId) {
        return roleRepository.findById(roleId)
                .map(Role::getPermissions);
    }

    public void addRolePermissions(UUID roleId, List<UUID> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        List<Permission> permissions = permissionRepository.findAllById(permissionIds);

        role.setPermissions(new HashSet<>(permissions));
        roleRepository.save(role);
    }

    public List<Role> createRoles(List<Role> roles) {
        return roleRepository.saveAll(roles);
    }




}
