import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  stockId: number;
  stockPrice: number;
  companyName: string;
  tickerSymbol: string;
  exchange: string;
  sector: string;
  ipoQty: number;
  imageURL: string;
  desc: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/watchlist/default`, { withCredentials: true });
  }

  addStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.baseUrl}/admin/stocks`, stock, { withCredentials: true });
  }

  updateStock(id: number, newPrice: number): Observable<Stock> {
    return this.http.put<Stock>(`${this.baseUrl}/admin/stocks`, { id, newPrice }, { withCredentials: true });
  }

  deleteStock(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/admin/stocks`, {
      body: { id },
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}
