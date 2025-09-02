package com.example.demo.dto;

import java.time.LocalDateTime;

public class VisitorEmployeeDto {
    private Long idVisiteur;
    private Long idEmploye;
    private LocalDateTime dateAffectation;
    private String commentaire;

    public VisitorEmployeeDto() {}

    public VisitorEmployeeDto(Long idVisiteur, Long idEmploye, LocalDateTime dateAffectation, String commentaire) {
        this.idVisiteur = idVisiteur;
        this.idEmploye = idEmploye;
        this.dateAffectation = dateAffectation;
        this.commentaire = commentaire;
    }

    public Long getIdVisiteur() {
        return idVisiteur;
    }

    public void setIdVisiteur(Long idVisiteur) {
        this.idVisiteur = idVisiteur;
    }

    public Long getIdEmploye() {
        return idEmploye;
    }

    public void setIdEmploye(Long idEmploye) {
        this.idEmploye = idEmploye;
    }

    public LocalDateTime getDateAffectation() {
        return dateAffectation;
    }

    public void setDateAffectation(LocalDateTime dateAffectation) {
        this.dateAffectation = dateAffectation;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}

