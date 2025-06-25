import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.http.post('http://localhost:8080/auth/login', loginData)
        .pipe(
          catchError(error => {
            console.error('Login failed:', error);
            return of(null); // Or handle with a notification service
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Login successful:', response);
            // e.g., localStorage.setItem('token', response.token);
            // this.router.navigate(['/dashboard']); // if using routing
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
