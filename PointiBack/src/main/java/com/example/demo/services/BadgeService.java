package com.example.demo.services;

import com.example.demo.entities.Badge;
import com.example.demo.repositories.BadgeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BadgeService {

    private final BadgeRepository badgeRepository;

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public Optional<Badge> getBadgeById(UUID id) {
        return badgeRepository.findById(id);
    }

    public Badge createBadge(Badge badge) {
        return badgeRepository.save(badge);
    }

    public Badge updateBadge(UUID id, Badge updatedBadge) {
        return badgeRepository.findById(id).map(badge -> {
            badge.setName(updatedBadge.getName());
            badge.setColor(updatedBadge.getColor());
            badge.setDescription(updatedBadge.getDescription());
            badge.setAssigned(updatedBadge.isAssigned());
            return badgeRepository.save(badge);
        }).orElseThrow(() -> new RuntimeException("Badge not found with id: " + id));
    }

    public void deleteBadge(UUID id) {
        badgeRepository.deleteById(id);
    }

    public List<Badge> saveBadges(List<Badge> badges) {
        return badgeRepository.saveAll(badges);
    }

}
