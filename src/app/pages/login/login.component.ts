import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,ToastrModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: ''
  };

  constructor(private http: HttpClient,
              private router: Router,
              private toastr:ToastrService,
              private authService: AuthService
  ) {}

  onSubmit() {
    this.http.post<any>('http://localhost:8080/api/auth/login', this.loginData)
      .subscribe({
        next: (res) => {
          console.log('Login response:', res);

          // Save the JWT token using AuthService
          const token = res.data?.token;

          if (token) {
            this.authService.saveToken(token);
            localStorage.setItem('username', res.data.username);

            this.toastr.success('Login successful! Welcome to your dashboard.');
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Login failed! No token received.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.toastr.error('Login failed! Please check your credentials and try again.');
        }
      });
  }

}
