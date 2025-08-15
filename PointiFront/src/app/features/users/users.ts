import { Component, OnInit, inject } from '@angular/core';
import { showConfirmDialog } from '../../shared/utils/sweetalert';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, forkJoin, lastValueFrom, map, of } from 'rxjs';

interface Role {
 
  nom: string;
  
}

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
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

    roles: any[] = [];
    selectedRole: string = '';
    selectedRoleId: string = '';
    selectedUserForRole: any = null;


  private http = inject(HttpClient);
  
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  

ngOnInit() {
    this.loadUsers();
    this.http.get<PaginatedResponse<Role>>('http://localhost:8080/roles', {headers}).subscribe({
    next: data => {
    this.roles = data.content; // ✅ accède à content sans erreur
    console.log(this.roles);
  },
    error: err => console.error('Erreur chargement rôles', err)
  });

  
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }

assignRoleToUser(userId: string, roleId: string) {
  if (!roleId) {
    console.error("Aucun rôle sélectionné");
    return;
  }

  const url = `http://localhost:8080/users/${userId}/modify-role/${roleId}`;
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  };

  this.http.put<User>(url, {}, { headers }).subscribe({
    next: updatedUser => {
      console.log('Rôle assigné avec succès', updatedUser);

      // 🔁 Update the user in the local users array
      const index = this.users.findIndex(u => u.id === userId);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.filteredUsers[index] = updatedUser; // if you use a filtered list
      }

      // Optional: Close the modal
      this.closeModal();
    },
    error: err => {
      console.error('Erreur lors de l\'assignation du rôle', err);
    }
  });
}

get pageNumbers(): number[] {
  return Array(this.totalPages).fill(0).map((x, i) => i);
}

goToPage(page: number) {
  this.currentPage = page;
  this.loadUsers();
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadUsers();
  }
}

previousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadUsers();
  }
}


closeModal() {
  // Fermer modal Bootstrap via JS
  const modalElement = document.getElementById('exampleModal');
  if (modalElement) {
    // @ts-ignore
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
}

   async loadUsers() {
  this.loading = true;
  this.error = '';
  const headers = this.getHeaders();
  

  try {
    const response = await lastValueFrom(
      this.http.get<any>(`http://localhost:8080/users?page=${this.currentPage}&size=${this.pageSize}`, { headers }).pipe(
        catchError(err => {
          console.error('Error loading users:', err);
          throw 'Failed to load users. Please try again.';
        })
      )
    );

    this.users = response.content;
    this.filteredUsers = response.content;
    this.totalPages = response.totalPages;
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

async deleteUser(user: User) {
  const confirmed = await showConfirmDialog({
    title: 'Suppression',
    text: `Supprimer ${user.firstName} ${user.lastName} ?`,
    icon: 'warning',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });
  if (confirmed) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.delete(`http://localhost:8080/users/${user.id}`, { headers })
      .subscribe({
        next: () => {
          alert('User deleted!');
          this.loadUsers();
        },
        error: (err) => {
          alert('Delete failed!');
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