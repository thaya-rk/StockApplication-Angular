import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    FormsModule,
    RouterLink
  ]
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    mpin: '',
    fullName: '',
    mobileNumber: '',
    dob: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:8080/api/auth/register', this.user, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Registration failed: ' + err.error.message);
        }
      });
  }
}
