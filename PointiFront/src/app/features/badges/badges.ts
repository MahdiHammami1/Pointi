import { showConfirmDialog } from '../../shared/utils/sweetalert';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders({
  'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
});


@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './badges.html',
  styleUrls: ['./badges.css']
})
export class BadgesComponent {
  badgeForm: FormGroup;
  badges: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.badgeForm = this.fb.group({
      name: [''],
      description: [''],
      color: ['#2196F3']
    });

    this.loadBadges();
  }

    private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }

  loadBadges(): void {
    this.http.get<any[]>('http://localhost:8080/badges',{ headers } ).subscribe(data => {
      this.badges = data;
    });
  }

  createBadge(): void {
    if (this.badgeForm.valid) {
      const newBadge = this.badgeForm.value;
      this.http.post('http://localhost:8080/badges', newBadge , { headers }).subscribe({
        next: () => {
          this.loadBadges();
          this.badgeForm.reset({ color: '#2196F3' });
        },
        error: err => console.error('Error creating badge:', err)
      });
    }
  }

  async deleteBadge(id: string): Promise<void> {
    const confirmed = await showConfirmDialog({
      title: 'Suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce badge ?',
      icon: 'warning',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });
    if (confirmed) {
      this.http.delete(`http://localhost:8080/badges/${id}`,{ headers }).subscribe({
        next: () => {
          this.badges = this.badges.filter(badge => badge.id !== id);
        },
        error: err => console.error('Error deleting badge:', err)
      });
    }
  }
}
