package com.example.demo.controllers;

import com.example.demo.entities.Visiteur;
import com.example.demo.services.VisiteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/visiteurs")
@RequiredArgsConstructor
public class VisiteurController {

    private final VisiteurService service;
    private final VisiteurService visiteurService;

    @GetMapping
    public List<Visiteur> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Visiteur create(@RequestBody Visiteur v) {
        return service.create(v);
    }

    @PutMapping("/{id}")
    public Visiteur update(@PathVariable Integer id, @RequestBody Visiteur v) {
        return service.update(id, v);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @PutMapping("/{visitorId}/set-badge/{badgeId}")
    public ResponseEntity<Visiteur> setBadgeToVisitor(
            @PathVariable Integer visitorId,
            @PathVariable UUID badgeId) {

        Visiteur updated = visiteurService.setBadgeToVisitor(visitorId, badgeId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{visitorId}/modify-badge/{badgeId}")
    public ResponseEntity<Visiteur> modifyBadgeOfVisitor(
            @PathVariable Integer visitorId,
            @PathVariable UUID badgeId) {

        Visiteur updated = visiteurService.modifyBadgeOfVisitor(visitorId, badgeId);
        return ResponseEntity.ok(updated);
    }


}

