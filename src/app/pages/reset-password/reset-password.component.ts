import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  validatePassword() {
    const password = this.newPassword;

    if (password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long.';
    } else if (!/[0-9]/.test(password)) {
      this.passwordError = 'Password must include at least one number.';
    } else if (!/[!@#$%^&*]/.test(password)) {
      this.passwordError = 'Password must include at least one special character.';
    } else {
      this.passwordError = '';
    }
  }

  resetPassword() {
    if (this.passwordError || this.newPassword !== this.confirmPassword) {
      this.toastr.error('Please fix the password issues');
      return;
    }

    this.authService.resetPasswordWithOtp(this.email, this.otp, this.newPassword)
      .subscribe({
        next: () => {
          this.toastr.success('Password Reset Successful');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Password Reset Failed');
        }
      });
  }
}
