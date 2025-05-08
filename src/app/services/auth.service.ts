import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl='http://localhost:8080/api/auth';
  private username:string='';

  constructor(private http:HttpClient) { }

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  register(user:any){
    return this.http.post(`${this.baseUrl}/register`,user,{withCredentials:true})
  }

  login(creds: any) {
    return this.http.post(`${this.baseUrl}/login`, creds, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }

  getCurrentUser() {
    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true });
  }
}
