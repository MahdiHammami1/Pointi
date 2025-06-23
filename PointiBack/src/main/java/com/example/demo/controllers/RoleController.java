package com.example.demo.controllers;

import com.example.demo.entities.Role;
import com.example.demo.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/add")
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

}
