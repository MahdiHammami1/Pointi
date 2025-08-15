import { CommonModule } from '@angular/common';
import { showConfirmDialog } from '../../shared/utils/sweetalert';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, lastValueFrom } from 'rxjs';

enum Direction {
  RH = 'RH',
  IT = 'IT',
  FINANCE = 'FINANCE',
}


 interface Badge {
  id?: string; // UUID - optional for creation
  name: string;
  color?: string;
  description?: string;
  assigned?: boolean;
}
interface Employee {
  id?: number;
  idInterne: number;
  numTel: number;
  numTellp: number;
  numBureau: number;
  nomPrenom: string;
  direction: Direction;
  email: string;
  createdAt?: string;
  modifiedAt?: string;
  badge:Badge ;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule  , ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  badges: any[] = [];
  selectedBadgeId: string = '';
  selectedEmployeeId: number | null = null;

  employeeForm!: FormGroup;
  showSuccessAlert = false;
  showErrorAlert = false;
  errorMessage = '';
  successMessage = '';


  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.employeeForm = new FormGroup({
    nomPrenom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    idInterne: new FormControl('', Validators.required),
    numTel: new FormControl('', Validators.required),
    numTellp: new FormControl('', Validators.required),
    numBureau: new FormControl('', Validators.required),
    direction: new FormControl('RH', Validators.required)
});
  }

  async loadEmployees() {
    this.loading = true;
    this.error = '';
    const headers = this.getHeaders();

    try {
      const response = await lastValueFrom(
        this.http.get<any>(`http://localhost:8080/employees?page=${this.currentPage}&size=${this.pageSize}`, { headers })
    .pipe(
          catchError(err => {
            console.error('Error loading users:', err);
            throw 'Failed to load users. Please try again.';
          })
        )
      );

      this.employees = response.content;
      this.filteredEmployees = response.content;
      this.totalPages = response.totalPages;
    } catch (error) {
      this.error = typeof error === 'string' ? error : 'Failed to load users.';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  get pagedEmployees(): Employee[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredEmployees = this.employees;
      return;
    }

    this.filteredEmployees = this.employees.filter(employee =>
      employee.nomPrenom.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.numTel.toString().includes(term) ||
      employee.numTellp.toString().includes(term)
    );
  }

  get pageNumbers(): number[] {
  return Array(this.totalPages).fill(0).map((x, i) => i);
}

goToPage(page: number) {
  this.currentPage = page;
  this.loadEmployees();
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadEmployees();
  }
}

previousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.loadEmployees();
  }
}

async deleteEmployee(id?: number): Promise<void> {
   const confirmed = await showConfirmDialog({
     title: 'Suppression',
     text: 'Voulez-vous vraiment supprimer cet employé ?',
     icon: 'warning',
     confirmButtonText: 'Oui, supprimer',
     cancelButtonText: 'Annuler'
   });
   if (!confirmed) return;

   this.loading = true;
   this.error = '';
   const headers = this.getHeaders();

   try {
     await lastValueFrom(
       this.http.delete(`http://localhost:8080/employees/${id}`, { headers }).pipe(
         catchError(err => {
           console.error('Erreur lors de la suppression :', err);
           throw 'Échec de la suppression. Veuillez réessayer.';
         })
       )
     );

     // Mise à jour locale de la liste
     this.employees = this.employees.filter(emp => emp.id !== id);
     this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== id);

     // Recalculer pagination si nécessaire
     this.totalPages = Math.ceil(this.employees.length / this.pageSize);

   } catch (error) {
     this.error = typeof error === 'string' ? error : 'Échec de la suppression.';
   } finally {
     this.loading = false;
   }
}

createEmployee(): void {
  if (!this.employeeForm.valid) {
    this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    this.showErrorAlert = true;
    return;
  }

  const newEmployee: Employee = this.employeeForm.value;

  this.http.post<Employee>('http://localhost:8080/employees', newEmployee, {
    headers: this.getHeaders()
  }).subscribe({
    next: () => {
      this.loadEmployees();
      this.showSuccessAlert = true;
      this.successMessage = 'Employé créé avec succès.';
      this.employeeForm.reset();
    },
    error: err => {
      console.error('Erreur lors de la création de l\'employé', err);
      this.errorMessage = 'Erreur lors de la création.';
      this.showErrorAlert = true;
    }
  });
 }
 
  openEditBadgeModal(employeeId: number) {
    this.selectedEmployeeId = employeeId;
    

    this.http.get<any>('http://localhost:8080/badges', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.badges = data;
      },
      error: (err) => {
        console.error('Erreur chargement badges', err);
      }
    });
  }

  assignBadgeToEmployee() {
    if (!this.selectedBadgeId || this.selectedEmployeeId === null) return;

    const url = `http://localhost:8080/employees/${this.selectedEmployeeId}/badge/${this.selectedBadgeId}`;
    this.http.put(url, {}, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert('Badge assigné avec succès');
        this.selectedBadgeId = '';
        this.selectedEmployeeId = null;
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Erreur lors de l’assignation du badge', err);
      }
    });
  }

   getBadgeName(employee: Employee): string {
    return employee?.badge?.name || 'No Role';
  }


}