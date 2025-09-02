import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { BadgeService } from '../../service/badge.service';
import { EmployeeService } from '../../service/employee.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, NgClass],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  badges: any[] = [];
  employeesCount: number = 0;
  overtimeHours: string = '0h';
  overtimeChange: string = '0h';
  peakHoursData: Array<{ hour: string; count: number; height: string }> = [];
  recentActivities: Array<{ name: string; action: string; time: string; status: string }> = [];
  teamEmployees: Array<{ initials: string; name: string; role: string; status: string }> = [];
  visiteursCount: number = 0;
  badgesCount: number = 0;
  affectationsCount: number = 0;

  constructor(private badgeService: BadgeService, private employeeService: EmployeeService, private http: HttpClient) {}

  ngOnInit(): void {
    this.badgeService.getBadges().subscribe(data => {
      this.badges = data;
      this.badgesCount = data.length;
    });
    this.employeeService.getEmployeesPaginated(0, 1).subscribe({
      next: data => {
        this.employeesCount = data.totalElements || data.totalItems || data.total || (data.content ? data.content.length : 0);
      },
      error: err => {
        console.error('Erreur API employees:', err);
      }
    });
    // Visiteurs
    this.http.get<any>('http://localhost:8080/visiteurs').subscribe({
      next: data => {
        this.visiteursCount = Array.isArray(data) ? data.length : (data.content ? data.content.length : 0);
      },
      error: err => {
        console.error('Erreur API visiteurs:', err);
      }
    });
    // Badges
    this.http.get<any>('http://localhost:8080/badges').subscribe({
      next: data => {
        this.badgesCount = Array.isArray(data) ? data.length : (data.content ? data.content.length : 0);
      },
      error: err => {
        console.error('Erreur API badges:', err);
      }
    });
    // Affectations
    this.http.get<any>('http://localhost:8080/visitor-employee/affectations').subscribe({
      next: data => {
        this.affectationsCount = Array.isArray(data) ? data.length : (data.content ? data.content.length : 0);
      },
      error: err => {
        console.error('Erreur API affectations:', err);
      }
    });
    // Employees (team)
    this.http.get<any>('http://localhost:8080/employees').subscribe({
      next: data => {
        const employees = Array.isArray(data) ? data : (data.content ? data.content : []);
        this.teamEmployees = employees.map((e: any) => ({
          initials: (e.nomPrenom || '').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          name: e.nomPrenom,
          role: e.direction || 'Employé',
          status: 'Présent' // TODO: replace with real status if available
        }));
      },
      error: err => {
        console.error('Erreur API employees:', err);
      }
    });
    // Example: peakHoursData and recentActivities can be filled with backend data if available
  }

  get activeBadgesCount(): number {
    return this.badges.length;
  }

  get pendingBadgesCount(): number {
    return this.badges.filter(b => b.status === 'En attente' || b.statut === 'En attente').length;
  }
}
