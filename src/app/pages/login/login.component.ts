import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ToastrModule, ToastrService} from 'ngx-toastr';

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
              private toastr:ToastrService) {}

  onSubmit() {
    this.http.post<any>('http://localhost:8080/api/auth/login', this.loginData,{withCredentials:true})
      .subscribe({
        next: (res) => {
          localStorage.setItem('username', this.loginData.usernameOrEmail);
          this.toastr.success('Login successful! Welcome to your dashboard.');
          this.router.navigate(['/home'])
        },
        error: (err) => {
          this.toastr.error('Login failed! Please check your credentials and try again.');
        }
      });
  }
}
