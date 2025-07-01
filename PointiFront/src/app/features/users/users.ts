import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, forkJoin, lastValueFrom, map, of } from 'rxjs';

interface Role {
 
  nom: string;
  
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
  role?: Role; // Optional role field 
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

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }

    async loadUsers() {
    this.loading = true;
    this.error = '';
    const headers = this.getHeaders();

    try {
      // Fetch all users (with roles included)
      const users = await lastValueFrom(
        this.http.get<User[]>('http://localhost:8080/users', { headers }).pipe(
          catchError(err => {
            console.error('Error loading users:', err);
            throw 'Failed to load users. Please try again.';
          })
        )
      );

      // No need for separate role calls - roles are already included
      this.users = users;
      this.filteredUsers = users;
    } catch (error) {
      this.error = typeof error === 'string' ? error : 'Failed to load users.';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  // Helper method to get role name safely
  getRoleName(user: User): string {
    return user?.role?.nom || 'No Role';
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
  if (confirm(`Delete ${user.firstName} ${user.lastName}?`)) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Get token from storage
    });

    this.http.delete(`http://localhost:8080/users/${user.id}`, { headers })
      .subscribe({
        next: () => {
          alert('User deleted!'); // Simple alert instead of snackbar
          this.loadUsers(); // Refresh the list
        },
        error: (err) => {
          alert('Delete failed!'); // Simple error alert
          console.error(err);
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