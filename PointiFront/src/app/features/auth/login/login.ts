import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Redirection si déjà authentifié
    if (localStorage.getItem('token')) {
      const userString = localStorage.getItem('user');
      let user: any = null;
      try {
        user = userString ? JSON.parse(userString) : null;
      } catch (e) {
        user = null;
      }
      if (user && user.role && user.role.nom === 'SECURITYAGENT') {
        this.router.navigateByUrl('/securityagent');
      } else {
        this.router.navigateByUrl('/loggedin/home');
      }
      return;
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post<any>('http://localhost:8080/auth/login', loginData)
      .pipe(
        catchError(error => {
          console.error(error);
          this.showMessage('Invalid email or password', 'error');
          return of(null);
        })
      )
      .subscribe(response => {
        console.log('🚀 Réponse brute du backend :', response);

        if (response && response.token && response.user) {
          // ✅ Sauvegarde
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          // ✅ Message
          this.showMessage('Login successful', 'success');

          // ✅ Redirection selon le rôle
          const role = response.user.role.nom;
          if (role === 'SECURITYAGENT') {
            this.router.navigateByUrl('/securityagent');
          } else {
            this.router.navigateByUrl('/loggedin/home');
          }
        }
      });

  } else {
    this.showMessage('Please fill out the form correctly.', 'error');
  }
}


  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
      verticalPosition: 'top'
    });
  }
}
