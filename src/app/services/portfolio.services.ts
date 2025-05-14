import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Holding {
  stockName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private baseUrl = 'http://localhost:8080/api/portfolio'; // adjust if needed

  constructor(private http: HttpClient) {}

  getHoldings(userId: number): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.baseUrl}/${userId}`,{withCredentials: true});
  }
}
