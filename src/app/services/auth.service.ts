import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'jwtToken';

  constructor(private http: HttpClient) {
  }

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/login', credentials, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post('http://localhost:8080/api/auth/logout', {}, {
      withCredentials: true
    });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8080/api/auth/me', {
      withCredentials: true
    });
  }
}
