import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = 'https://services.gomobi.io/api/fpx'; // Correct endpoint

  constructor(private http: HttpClient) {}

  getBankList(): Observable<any> {
    const requestBody = { Service: 'FULL_LIST' };
    return this.http.post<any>(this.apiUrl, requestBody); // Must be POST
  }
}
