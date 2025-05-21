import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  step: number = 1;

  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mpin: '',
    fullName: '',
    mobileNumber: '',
    dob: '',
    confirmMpin: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  onSubmit() {
    this.http.post('http://localhost:8080/api/auth/register', this.user, { withCredentials: true })
      .subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Registration failed: ' + err.error.message);
        }
      });
  }

  checkAge(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birthDate.getDate());
  }


}
