package com.example.demo.repositories;

import com.example.demo.entities.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BadgeRepository extends JpaRepository<Badge, UUID> {
}
