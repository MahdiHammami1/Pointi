package com.example.demo.services;

import com.example.demo.entities.Badge;
import com.example.demo.entities.Visiteur;
import com.example.demo.repositories.BadgeRepository;
import com.example.demo.repositories.VisiteurRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisiteurServiceTest {

    @Mock
    private VisiteurRepository visiteurRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @InjectMocks
    private VisiteurService visiteurService;

    @Test
    void getAll_shouldReturnListOfVisiteurs() {
        List<Visiteur> list = List.of(new Visiteur(), new Visiteur());
        when(visiteurRepository.findAll()).thenReturn(list);
        assertEquals(2, visiteurService.getAll().size());
    }

    @Test
    void create_shouldSaveVisiteur() {
        Visiteur v = new Visiteur();
        when(visiteurRepository.save(v)).thenReturn(v);
        assertEquals(v, visiteurService.create(v));
    }

    @Test
    void delete_shouldCallRepositoryDeleteById() {
        visiteurService.delete(1);
        verify(visiteurRepository).deleteById(1);
    }

    @Test
    void update_shouldUpdateVisiteurFields() {
        int id = 1;
        Visiteur existing = new Visiteur();
        Visiteur updated = new Visiteur();
        updated.setNomPrenom("Ali");
        updated.setCin(12548856);
        updated.setOrganisation("Entreprise");

        when(visiteurRepository.findById(id)).thenReturn(Optional.of(existing));
        when(visiteurRepository.save(existing)).thenReturn(existing);

        Visiteur result = visiteurService.update(id, updated);
        assertEquals("Ali", result.getNomPrenom());
        // On vérifie bien le CIN passé en entrée
        assertEquals(12548856, result.getCin());
        assertEquals("Entreprise", result.getOrganisation());
    }

    @Test
    void setBadgeToVisitor_shouldAssignBadge() {
        int id = 1;
        UUID badgeId = UUID.randomUUID();
        Visiteur v = new Visiteur();
        Badge b = new Badge();

        when(visiteurRepository.findById(id)).thenReturn(Optional.of(v));
        when(badgeRepository.findById(badgeId)).thenReturn(Optional.of(b));
        when(visiteurRepository.save(v)).thenReturn(v);

        assertEquals(b, visiteurService.setBadgeToVisitor(id, badgeId).getBadge());
    }

    @Test
    void modifyBadgeOfVisitor_shouldChangeBadge() {
        int id = 1;
        UUID badgeId = UUID.randomUUID();
        Visiteur v = new Visiteur();
        Badge b = new Badge();

        when(visiteurRepository.findById(id)).thenReturn(Optional.of(v));
        when(badgeRepository.findById(badgeId)).thenReturn(Optional.of(b));
        when(visiteurRepository.save(v)).thenReturn(v);

        assertEquals(b, visiteurService.modifyBadgeOfVisitor(id, badgeId).getBadge());
    }
}
