package com.example.demo.services;

import com.example.demo.entities.Badge;
import com.example.demo.entities.Employee;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.BadgeRepository;
import com.example.demo.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BadgeRepository badgeRepository;

    public EmployeeService(EmployeeRepository employeeRepository, BadgeRepository badgeRepository) {
        this.employeeRepository = employeeRepository;
        this.badgeRepository = badgeRepository;
    }

    public Page<Employee> findAll(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    public Optional<Employee> findById(Integer id) {
        return employeeRepository.findById(id);
    }

    public Employee save(Employee employe) {
        return employeeRepository.save(employe);
    }

    public void deleteById(Integer id) {
        employeeRepository.deleteById(id);
    }

    public Employee update(Integer id, Employee updated) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    updated.setId(id);
                    return employeeRepository.save(updated);
                })
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
    }

    public Employee setBadgeToEmployee(Integer employeeId, UUID badgeID) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Badge existingBadge = badgeRepository.findById(badgeID)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        employee.setBadge(existingBadge);
        return employeeRepository.save(employee);
    }

    public Employee modifyRoleOfUser(Integer employeeID, UUID badgeID) {
        Employee employee = employeeRepository.findById(employeeID)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Badge newBadge = badgeRepository.findById(badgeID)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        employee.setBadge(newBadge);
        return employeeRepository.save(employee);
    }
}
