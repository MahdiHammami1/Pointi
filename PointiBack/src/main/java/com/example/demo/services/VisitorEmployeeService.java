package com.example.demo.services;

import com.example.demo.dto.VisitorEmployeeDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VisitorEmployeeService {
    private final List<VisitorEmployeeDto> affectations = new ArrayList<>();

    public VisitorEmployeeDto affecterVisiteurAEmploye(VisitorEmployeeDto dto) {
        affectations.add(dto);
        return dto;
    }

    public List<VisitorEmployeeDto> listerAffectations() {
        return new ArrayList<>(affectations);
    }
}

