import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // adjust path if needed
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  countdown = 0; // seconds left
  countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.authService.sendPasswordResetEmail(email).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Password reset link sent successfully!';
        this.startCountdown(15 * 60);// 15 minutes countdown
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email }
          });
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  formatTime(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  goBackToLogin(): void {
    this.router.navigate(['/login']);
  }
  get emailErrors(): { [key: string]: any } | null {
    return this.f['email'].errors;
  }

}
