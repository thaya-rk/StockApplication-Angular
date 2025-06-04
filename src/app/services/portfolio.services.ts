import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Holding, Summary, StockSummary } from '../models/portfolio.model';
import {Charges} from '../models/charges.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private baseUrl = 'http://localhost:8080/api/portfolio';

  constructor(private http: HttpClient) {}

  getHoldings(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.baseUrl}/holdings`, {
      withCredentials: true
    });
  }

  getSummary():Observable<Summary>{
    return this.http.get<Summary>(`${this.baseUrl}/summary`,{
      withCredentials:true
    })
  }

  getStockSummary():Observable<StockSummary>{
    return this.http.get<StockSummary>(`${this.baseUrl}/stats`,{
      withCredentials:true
    })
  }

  getTransactionCharges(stockId: number, quantity: number): Observable<Charges> {
    const body = { stockId, quantity };
    return this.http.post<Charges>(`${this.baseUrl}/charges`, body, { withCredentials: true });
  }
}
