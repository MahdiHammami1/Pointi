package com.example.demo.entities;

import com.example.demo.enums.Direction;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer idInterne;
    private Integer numTel;
    private Integer numTellp;
    private Integer numBureau;

    private String nomPrenom;

    @Enumerated(EnumType.STRING)
    private Direction direction;

    private String email;

    @ManyToOne
    @JoinColumn(name = "badge_id")

    private Badge badge;

    @Column(updatable = false , name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;



    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.modifiedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.modifiedAt = LocalDateTime.now();
    }

}
