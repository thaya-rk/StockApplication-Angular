import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = 'https://services.gomobi.io/api/fpx';

  constructor(private http: HttpClient) {}

  // Get All bank List
  getBankList(): Observable<any> {
    const requestBody = { Service: 'FULL_LIST' };
    return this.http.post<any>(this.apiUrl, requestBody);
  }
}
