package com.example.demo.controllers;

import com.example.demo.entities.Permission;
import com.example.demo.services.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;




    @PostMapping("/add")
    public Permission createPermission(@RequestBody Permission permission) {
        return permissionService.createPermission(permission);
    }

    @GetMapping
    public List<Permission> getAllPermissions() {
        return permissionService.getAllPermissions();
    }

    @GetMapping("/getById/{id}")
    public Optional<Permission> getPermissionById(@PathVariable UUID id) {
        return permissionService.getPermissionById(id);
    }

    @PutMapping("/{id}")
    public Permission updatePermission(@PathVariable UUID id, @RequestBody Permission permission) {
        return permissionService.updatePermission(id, permission);
    }

    @DeleteMapping("/{id}")
    public void deletePermission(@PathVariable UUID id) {
        permissionService.deletePermission(id);
    }
}
