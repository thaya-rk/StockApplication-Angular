import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  error: string = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match";
      this.success = '';
      return;
    }

    this.http.post('http://localhost:8080/api/auth/reset-password', {
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error.message || 'Reset failed'
    });
  }
}
