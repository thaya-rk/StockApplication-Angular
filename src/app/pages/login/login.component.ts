import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<any>('http://localhost:8080/api/auth/login', this.loginData,{withCredentials:true})
      .subscribe({
        next: (res) => {
          alert(res.message || 'Login successful');
          localStorage.setItem('username', this.loginData.usernameOrEmail);
          console.log("Login hit")
          this.router.navigate(['/home'])
        },
        error: (err) => {
          alert(err.error.message || 'Login failed');
        }
      });
  }
}
