import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'jwtToken';
  private currentUser: any = null;
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    this.currentUser = null;
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    });
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  getCurrentUser(): Observable<any> {
    if (this.currentUser) {
      return of({ data: this.currentUser });
    }

    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.currentUser = response.data;
      })
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPasswordWithOtp(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email, otp, newPassword }, {
      withCredentials: true
    });
  }

  // Send email verification OTP — no param because it uses authenticated user info
  sendEmailVerification(): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-verification-email`, {}, {
      withCredentials: true
    });
  }

  // Verify email OTP
  verifyEmailOtp(otp: string): Observable<any> {
    // The backend expects the OTP and gets username from the token (principal)
    return this.http.post(`${this.baseUrl}/verify-email`, { otp }, {
      withCredentials: true
    });
  }

  isUserVerified(): Observable<boolean> {
    return this.http.get<any>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      map(response => {
        console.log('User response from API:', response);
        return response.data.emailVerified; // now correctly set
      })
    );
  }



}
