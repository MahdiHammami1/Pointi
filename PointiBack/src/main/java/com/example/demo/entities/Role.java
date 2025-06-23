package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nom;

    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;
}
