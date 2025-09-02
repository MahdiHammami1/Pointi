package com.example.demo.controllers;

import com.example.demo.dto.VisitorEmployeeDto;
import com.example.demo.services.VisitorEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visitor-employee")
public class VisitorEmployeeController {

    @Autowired
    private VisitorEmployeeService visitorEmployeeService;

    @PostMapping("/affecter")
    public VisitorEmployeeDto affecterVisiteurAEmploye(@RequestBody VisitorEmployeeDto dto) {
        return visitorEmployeeService.affecterVisiteurAEmploye(dto);
    }

    @GetMapping("/affectations")
    public List<VisitorEmployeeDto> listerAffectations() {
        return visitorEmployeeService.listerAffectations();
    }
}

