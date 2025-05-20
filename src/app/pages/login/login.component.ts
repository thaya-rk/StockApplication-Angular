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
    this.authService.setCurrentUser(null);
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe({

          next: (response) => {
            const userData = response.data;
            const role = userData.role;
            const username = userData.username;

            this.authService.setCurrentUser(userData);
            console.log("User role from login",role);

            localStorage.setItem('role', role);
            localStorage.setItem('username', username);

            this.toastr.success('Login successful! Redirecting...');
            console.log(role)

            if (role === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            console.error('Error fetching user info:', err);
            this.toastr.error('Failed to retrieve user info.');
          }
        });
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error('Login failed! Please check your credentials.');
      }
    });
  }

}
