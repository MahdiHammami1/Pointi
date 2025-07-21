package com.example.demo.services;


import com.example.demo.entities.Badge;
import com.example.demo.repositories.BadgeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BadgeServiceTest {

    @Mock
    private BadgeRepository badgeRepository;

    @InjectMocks
    private BadgeService badgeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllBadges_shouldReturnList() {
        List<Badge> mockBadges = List.of(new Badge(), new Badge());
        when(badgeRepository.findAll()).thenReturn(mockBadges);

        List<Badge> result = badgeService.getAllBadges();

        assertEquals(2, result.size());
        verify(badgeRepository).findAll();
    }

    @Test
    void getBadgeById_shouldReturnBadge() {
        UUID id = UUID.randomUUID();
        Badge badge = new Badge();
        when(badgeRepository.findById(id)).thenReturn(Optional.of(badge));

        Optional<Badge> result = badgeService.getBadgeById(id);

        assertTrue(result.isPresent());
        assertEquals(badge, result.get());
    }

    @Test
    void createBadge_shouldSaveAndReturnBadge() {
        Badge badge = new Badge();
        when(badgeRepository.save(badge)).thenReturn(badge);

        Badge result = badgeService.createBadge(badge);

        assertEquals(badge, result);
        verify(badgeRepository).save(badge);
    }

    @Test
    void updateBadge_shouldUpdateFieldsAndSave() {
        UUID id = UUID.randomUUID();
        Badge existing = new Badge();
        existing.setName("Old");
        existing.setAssigned(false);

        Badge updated = new Badge();
        updated.setName("New");
        updated.setColor("Red");
        updated.setDescription("Updated description");
        updated.setAssigned(true);

        when(badgeRepository.findById(id)).thenReturn(Optional.of(existing));
        when(badgeRepository.save(any(Badge.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Badge result = badgeService.updateBadge(id, updated);

        assertEquals("New", result.getName());
        assertEquals("Red", result.getColor());
        assertEquals("Updated description", result.getDescription());
        assertTrue(result.isAssigned());
        verify(badgeRepository).save(existing);
    }

    @Test
    void updateBadge_shouldThrowIfNotFound() {
        UUID id = UUID.randomUUID();
        when(badgeRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                badgeService.updateBadge(id, new Badge()));

        assertTrue(exception.getMessage().contains("Badge not found"));
    }

    @Test
    void deleteBadge_shouldCallRepository() {
        UUID id = UUID.randomUUID();

        badgeService.deleteBadge(id);

        verify(badgeRepository).deleteById(id);
    }

    @Test
    void saveBadges_shouldSaveAll() {
        List<Badge> badges = List.of(new Badge(), new Badge());

        when(badgeRepository.saveAll(badges)).thenReturn(badges);

        List<Badge> result = badgeService.saveBadges(badges);

        assertEquals(2, result.size());
        verify(badgeRepository).saveAll(badges);
    }
}
