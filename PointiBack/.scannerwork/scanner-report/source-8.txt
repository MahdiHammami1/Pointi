package com.example.demo.controllers;

import com.example.demo.entities.Badge;
import com.example.demo.entities.User;
import com.example.demo.services.BadgeService;
import com.example.demo.services.EmployeeService;
import com.example.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;
    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Badge>> getAllBadges() {
        return ResponseEntity.ok(badgeService.getAllBadges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Badge> getBadgeById(@PathVariable UUID id) {
        return badgeService.getBadgeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Badge> createBadge(@RequestBody Badge badge) {
        return ResponseEntity.ok(badgeService.createBadge(badge));
    }

    @PostMapping("/addAll")
    public ResponseEntity<List<Badge>> updateBadges(@RequestBody List<Badge> badges) {
        return ResponseEntity.ok(
                badgeService.saveBadges(badges)
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<Badge> updateBadge(@PathVariable UUID id, @RequestBody Badge badge) {
        return ResponseEntity.ok(badgeService.updateBadge(id, badge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBadge(@PathVariable UUID id) {
        badgeService.deleteBadge(id);
        return ResponseEntity.noContent().build();
    }


}
