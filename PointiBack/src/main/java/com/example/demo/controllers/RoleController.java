package com.example.demo.controllers;

import com.example.demo.dto.PermissionIdsDTO;
import com.example.demo.entities.Permission;
import com.example.demo.entities.Role;
import com.example.demo.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("")
    public Role createRole(@RequestBody Role role) {
        return roleService.createRole(role);
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public Optional<Role> getRoleById(@PathVariable UUID id) {
        return roleService.getRoleById(id);
    }

    @PutMapping("/{id}")
    public Role updateRole(@PathVariable UUID id, @RequestBody Role role) {
        return roleService.updateRole(id, role);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
    }

    @PutMapping("/{roleId}/add-permission/{permissionId}")
    public Role addPermissionToRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {
        return roleService.addPermissionToRole(roleId, permissionId);
    }

    @PutMapping("/{roleId}/add-permission-name/{permissionName}")
    public Role addPermissionToRoleByName(
            @PathVariable UUID roleId,
            @PathVariable String permissionName) {
        return roleService.addPermissionToRoleByName(roleId, permissionName);
    }

    @PutMapping("/{roleId}/remove-permission/{permissionId}")
    public Role removePermissionFromRole(
            @PathVariable UUID roleId,
            @PathVariable UUID permissionId) {
        return roleService.removePermissionFromRole(roleId, permissionId);
    }

    @PutMapping("/{roleId}/remove-permission-name/{permissionName}")
    public Role removePermissionFromRoleByName(
            @PathVariable UUID roleId,
            @PathVariable String permissionName) {
        return roleService.removePermissionFromRoleByName(roleId, permissionName);
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<Permission>> getRolePermissions(@PathVariable UUID roleId) {
        return roleService.getRolePermissions(roleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{roleId}/permissions")
    public ResponseEntity<Void> addPermissionsToRole(
            @PathVariable UUID roleId,
            @RequestBody PermissionIdsDTO request) {

        roleService.addRolePermissions(roleId, request.getPermissionIds());
        return ResponseEntity.ok().build();
    }

}
