package com.example.demo.repositories;

import com.example.demo.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;
@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
}
