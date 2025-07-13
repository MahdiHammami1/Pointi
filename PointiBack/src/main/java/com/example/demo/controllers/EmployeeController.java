package com.example.demo.controllers;


import com.example.demo.entities.Employee;
import com.example.demo.entities.User;
import com.example.demo.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/employees")
@CrossOrigin
public class EmployeeController {

    @Autowired
    private EmployeeService employeService;
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public Page<Employee> getAll(@PageableDefault(page = 0, size = 5) Pageable pageable) {
        return employeService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Integer id) {
        return employeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Employee create(@RequestBody Employee employe) {
        return employeService.save(employe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Integer id, @RequestBody Employee updated) {
        try {
            return ResponseEntity.ok(employeService.update(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        employeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/set-badge")
    public Employee setBadgeToEmployee(@RequestParam Integer employeeID, @RequestParam UUID badgeID) {
        return employeeService.setBadgeToEmployee(employeeID, badgeID);
    }

    @PutMapping("/{employeeID}/badge/{badgeID}")
    public ResponseEntity<Employee> modifyRoleOfUser(
            @PathVariable Integer employeeID,
            @PathVariable UUID badgeID) {
        Employee updatedEmployee = employeeService.modifyRoleOfUser(employeeID, badgeID);
        return ResponseEntity.ok(updatedEmployee);
    }


}
