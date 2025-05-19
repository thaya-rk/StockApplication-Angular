import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = 'http://localhost:8080/api/account';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`, { withCredentials: true });
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/balance`, { withCredentials: true });
  }

  getLedger(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ledger`, { withCredentials: true });
  }

  deposit(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deposit`, { amount }, { withCredentials: true });
  }

  withdraw(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/withdraw`, { amount }, { withCredentials: true });
  }
}
