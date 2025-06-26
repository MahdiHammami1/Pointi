import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';


interface RegisterResponse {
  email: string | null;
  username: string | null;
  emailSent: boolean;
  message: string;
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.html',
})

export class Register {
  firstName = '';
  lastName = '';
  username = '';
  phoneNumber = '';
  dateOfBirth = '';
  email = '';
  password = '';
  

  constructor(
    private http: HttpClient,
     private router: Router,
  ) {}

  onSubmit() {
  const registerData = {
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    phoneNumber: this.phoneNumber,
    dateOfBirth: this.dateOfBirth,
    email: this.email,
    password: this.password
  };

   this.http.post<RegisterResponse>('http://localhost:8080/auth/signup', registerData)
    .pipe(
      catchError(error => {
        console.error('Registration failed:', error);
        // Retourne un objet simulant une erreur avec message
        return of({ emailSent: false, message: 'An unexpected error occurred.', email: null, username: null });
      })
    )
    .subscribe((response: RegisterResponse | null) => {
      if (response) {
        console.log('Registration message:', response.message);

        if (response.emailSent) {
          localStorage.setItem('emailToVerify', response.email || '');
         this.router.navigate(['/auth/verify']);
        }
        // Pas besoin d’un else ici, on affiche déjà le message quoi qu’il arrive
      }
    });
}
}
