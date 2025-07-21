package com.example.demo.repositories;

import com.example.demo.entities.Visiteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisiteurRepository extends JpaRepository<Visiteur, Integer> {
}