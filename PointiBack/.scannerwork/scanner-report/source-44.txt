package com.example.demo.services;

import com.example.demo.entities.Badge;
import com.example.demo.entities.Visiteur;
import com.example.demo.repositories.BadgeRepository;
import com.example.demo.repositories.VisiteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VisiteurService {

    private final VisiteurRepository repository;
    private final VisiteurRepository visiteurRepository;
    private final BadgeRepository badgeRepository;

    public List<Visiteur> getAll() {
        return repository.findAll();
    }

    public Visiteur create(Visiteur visiteur) {
        return repository.save(visiteur);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public Visiteur update(Integer id, Visiteur updated) {
        Visiteur existing = repository.findById(id).orElseThrow();
        existing.setNomPrenom(updated.getNomPrenom());
        existing.setCin(updated.getCin());
        existing.setOrganisation(updated.getOrganisation());
        return repository.save(existing);
    }

    public Visiteur setBadgeToVisitor(Integer visitorId, UUID badgeId) {
        Visiteur visitor = visiteurRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));

        Badge existingBadge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        visitor.setBadge(existingBadge);
        return visiteurRepository.save(visitor);
    }

    public Visiteur modifyBadgeOfVisitor(Integer visitorId, UUID badgeId) {
        Visiteur visitor = visiteurRepository.findById(visitorId)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));

        Badge newBadge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        visitor.setBadge(newBadge);
        return visiteurRepository.save(visitor);
    }

}

