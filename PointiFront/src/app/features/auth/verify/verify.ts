import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule,  } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './verify.html',
  styleUrls: ['./verify.css']
})
export class Verify{
  verificationCode = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.errorMessage.set('Please enter a valid 6-digit code');
      return;
    }
    console.log(localStorage.getItem('emailToVerify'));
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.http.post('http://localhost:8080/auth/verify', {
      email: localStorage.getItem('emailToVerify'),
      verificationCode: this.verificationCode
      }, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.successMessage.set(response);
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Verification failed');
        this.isLoading.set(false);
      }
    });
  }

  onCodeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.verificationCode = input.value;
    if (input.value.length === 6) {
      this.onSubmit();
    }
  }

  resendCode() {
  const email = localStorage.getItem('emailToVerify');
  if (!email) {
    this.errorMessage.set('No email found to resend code.');
    return;
  }

  this.http.post(`http://localhost:8080/auth/resend-code?email=${email}`, null, { responseType: 'text' })
    .subscribe({
      next: (msg) => this.successMessage.set('A new verification code has been sent.'),
      error: (err) => this.errorMessage.set(err.error || 'Failed to resend code.')
    });
 }
}