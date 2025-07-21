package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository  extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<Object> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    String email(String email);


}
