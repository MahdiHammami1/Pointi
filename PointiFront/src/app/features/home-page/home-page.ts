import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { BadgeService } from '../../service/badge.service';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, NgClass],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  badges: any[] = [];
  employeesCount: number = 0;

  get activeBadgesCount(): number {
    return this.badges.length;
  }

  get pendingBadgesCount(): number {
    return this.badges.filter(b => b.status === 'En attente' || b.statut === 'En attente').length;
  }

  constructor(private badgeService: BadgeService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.badgeService.getBadges().subscribe(data => {
      this.badges = data;
    });
    // Appel paginé pour récupérer le nombre total d'employés
    this.employeeService.getEmployeesPaginated(0, 1).subscribe({
      next: data => {
        // data doit contenir totalElements ou totalItems ou total
        this.employeesCount = data.totalElements || data.totalItems || data.total || (data.content ? data.content.length : 0);
        console.log('Employees paginated:', data);
      },
      error: err => {
        console.error('Erreur API employees:', err);
      }
    });
  }
}
