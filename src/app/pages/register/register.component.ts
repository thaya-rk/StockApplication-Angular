import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NgIf} from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    ToastrModule,],
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

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) {}

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
          this.toastr.success('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errorMessage = err.error.message || 'Registration failed';
          this.toastr.error(errorMessage);
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

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

// Mobile number check (10 digits only)
  isMobileValid(mobile: string): boolean {
    return /^\d{10}$/.test(mobile);
  }


}
