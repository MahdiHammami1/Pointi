import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  constructor(private http: HttpClient) {}

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

    this.http.post('http://localhost:8080/auth/signup', registerData)
      .pipe(
        catchError(error => {
          console.error('Registration failed:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Registration successful, Check your email for verification code :', response);
        // You can redirect or show a success message here
        }
      });
  }
}
