package com.example.demo.services;

import com.example.demo.entities.Badge;
import com.example.demo.entities.Employee;
import com.example.demo.repositories.BadgeRepository;
import com.example.demo.repositories.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private BadgeRepository badgeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_shouldReturnEmployee() {
        Integer id = 1;
        Employee emp = new Employee();
        when(employeeRepository.findById(id)).thenReturn(Optional.of(emp));

        Optional<Employee> result = employeeService.findById(id);

        assertTrue(result.isPresent());
        assertEquals(emp, result.get());
    }

    @Test
    void save_shouldReturnSavedEmployee() {
        Employee emp = new Employee();
        when(employeeRepository.save(emp)).thenReturn(emp);

        Employee result = employeeService.save(emp);

        assertEquals(emp, result);
        verify(employeeRepository).save(emp);
    }

    @Test
    void update_shouldReplaceAndSaveEmployee() {
        Integer id = 1;
        Employee oldEmp = new Employee();
        oldEmp.setId(id);

        Employee updated = new Employee();
        updated.setNomPrenom("Updated Name");

        when(employeeRepository.findById(id)).thenReturn(Optional.of(oldEmp));
        when(employeeRepository.save(updated)).thenReturn(updated);

        Employee result = employeeService.update(id, updated);

        assertEquals("Updated Name", result.getNomPrenom());
        verify(employeeRepository).save(updated);
    }

    @Test
    void update_shouldThrowIfNotFound() {
        Integer id = 1;
        when(employeeRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                employeeService.update(id, new Employee()));

        assertEquals("Employé introuvable", exception.getMessage());
    }

    @Test
    void setBadgeToEmployee_shouldAssignBadge() {
        Integer empId = 1;
        UUID badgeId = UUID.randomUUID();

        Employee employee = new Employee();
        Badge badge = new Badge();

        when(employeeRepository.findById(empId)).thenReturn(Optional.of(employee));
        when(badgeRepository.findById(badgeId)).thenReturn(Optional.of(badge));
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        Employee result = employeeService.setBadgeToEmployee(empId, badgeId);

        assertEquals(badge, result.getBadge());
        verify(employeeRepository).save(employee);
    }

    @Test
    void modifyRoleOfUser_shouldUpdateBadge() {
        Integer empId = 1;
        UUID badgeId = UUID.randomUUID();

        Employee employee = new Employee();
        Badge newBadge = new Badge();

        when(employeeRepository.findById(empId)).thenReturn(Optional.of(employee));
        when(badgeRepository.findById(badgeId)).thenReturn(Optional.of(newBadge));
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee result = employeeService.modifyRoleOfUser(empId, badgeId);

        assertEquals(newBadge, result.getBadge());
        verify(employeeRepository).save(employee);
    }
}
