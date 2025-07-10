package com.example.demo.services;

import com.example.demo.entities.Employee;
import com.example.demo.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
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
}
