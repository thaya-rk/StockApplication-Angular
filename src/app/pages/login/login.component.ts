import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: ''
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.toastr.success('Login successful! Redirecting...');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error('Login failed! Please check your credentials.');
      }
    });
  }
}
