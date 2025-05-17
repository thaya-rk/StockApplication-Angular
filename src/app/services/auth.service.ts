import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'jwtToken';

  constructor(private http: HttpClient) {}

  // Store token after login
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.TOKEN_KEY);
    return of();  // returns an Observable<void>
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp < now;
    } catch (error) {
      return true;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || decoded?.username || null;
    }
    return null;
  }
}
