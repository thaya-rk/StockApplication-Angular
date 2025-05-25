import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.services';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [NgIf, FormsModule],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  error: string = '';
  sendingVerification = false;
  otpSent = false;
  verifyingOtp = false;
  emailOtp = '';

  isDarkTheme = false;
  notificationsOn = true;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.accountService.getProfile().subscribe({
      next: (res) => (this.user = res),
      error: () => (this.error = 'Failed to load profile')
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  sendEmailVerification() {
    this.sendingVerification = true;
    this.error = '';
    this.authService.sendEmailVerification().subscribe({
      next: () => {
        this.sendingVerification = false;
        this.otpSent = true;
        this.toastr.success('Verification OTP sent. Please check your email.');
      },
      error: () => {
        this.sendingVerification = false;
        this.error = 'Failed to send verification email.';
      }
    });
  }

  verifyEmailOtp() {
    if (!this.emailOtp) {
      this.error = 'Please enter the OTP.';
      return;
    }

    this.verifyingOtp = true;
    this.error = '';
    this.authService.verifyEmailOtp(this.emailOtp).subscribe({
      next: () => {
        this.verifyingOtp = false;
        this.user.emailVerified = true; // update locally
        this.otpSent = false;
        this.emailOtp = '';
        this.toastr.success('Email verified successfully.');
      },
      error: () => {
        this.verifyingOtp = false;
        this.error = 'Invalid OTP or verification failed.';
      }
    });
  }
}
