import { Injectable } from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'jwtToken';
  private currentUser: any = null;

  constructor(private http: HttpClient) {
  }

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/login', credentials, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    this.currentUser = null;
    return this.http.post('http://localhost:8080/api/auth/logout', {}, {
      withCredentials: true
    });
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  getCurrentUser(): Observable<any> {
    if (this.currentUser) {
      return of({ data: this.currentUser }); // mimic backend response shape
    }

    return this.http.get('http://localhost:8080/api/auth/me', {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        this.currentUser = response.data; // cache it
      })
    );
  }

  sendPasswordResetEmail(email: string) {
    return this.http.post<any>('http://localhost:8080/api/auth/forgot-password', { email });
  }

}
