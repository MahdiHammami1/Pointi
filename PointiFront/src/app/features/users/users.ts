import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

interface Role {
  id: string;
  nom: string;
  permissions: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  lastLogin: string;
  createdAt: string;
  modifiedAt: string;
  role: Role; 
}
const headers = new HttpHeaders({
  'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
});
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users implements OnInit {
  private http = inject(HttpClient);
  
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.http.get<User[]>('http://localhost:8080/users', { headers })
      .subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users. Please try again.';
          this.loading = false;
          console.error('Error loading users:', err);
        }
      });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phoneNumber.toLowerCase().includes(term)
    );
  }

  createUser() {
    // Implement create user logic
    console.log('Create user clicked');
    // You can open a modal or navigate to a create form
  }

  editUser(user: User) {
    // Implement edit user logic
    console.log('Edit user:', user);
    // You can open a modal or navigate to an edit form
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.http.delete(`http://localhost:8080/users/${user.id}`)
        .subscribe({
          next: () => {
            this.loadUsers(); // Reload the list
          },
          error: (err) => {
            this.error = 'Failed to delete user. Please try again.';
            console.error('Error deleting user:', err);
          }
        });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  }
  trackByUserId(index: number, user: any): any {
  return user.id; // ou user.userId selon ta structure
}
}