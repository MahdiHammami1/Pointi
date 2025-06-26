import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 



interface RegisterResponse {
  email: string | null;
  username: string | null;
  emailSent: boolean;
  message: string;
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, HttpClientModule,],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class Register {
  firstName = '';
  lastName = '';
  username = '';
  phoneNumber = '';
  dateOfBirth = '';
  email = '';
  password = '';
  
  message = '';
  isError = false;
  isLoading = false;



  constructor(
    private http: HttpClient,
     private router: Router,
     private snackBar: MatSnackBar 
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
        this.showMessage(error.error?.message || 'Registration failed!', 'error');
        return of({ emailSent: false, message: 'An unexpected error occurred.', email: null, username: null });
      })
    )
    .subscribe((response: RegisterResponse | null) => {
      if (response) {
        console.log('Registration message:', response.message);

        if (response.emailSent) {
          localStorage.setItem('emailToVerify', response.email || '');
         this.router.navigate(['/auth/verify']);
        }else {
            this.showMessage(response.message, 'error');
          }
      }
    });
 }

 private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Auto-close after 5 seconds
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      verticalPosition: 'top' // Show at top of screen
    });
  }
}
