package com.example.demo.services;

import com.example.demo.entities.Role;
import com.example.demo.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

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
            role.setPermission(updatedRole.getPermission());
            return roleRepository.save(role);
        }).orElse(null);
    }

    public void deleteRole(UUID id) {
        roleRepository.deleteById(id);
    }
}
