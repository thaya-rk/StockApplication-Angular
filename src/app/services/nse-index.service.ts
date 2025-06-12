import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface StockData {
  symbol: string;
  lastPrice: number;
  change: number;
  pChange: number;
  meta?: { companyName?: string };
}

@Injectable({ providedIn: 'root' })
export class NseIndexService {
  private apiUrl = 'http://localhost:8080/nse/equity-stock-indices/NIFTY%2050';

  constructor(private http: HttpClient) {}

  getNiftyData(): Observable<StockData[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data ?? [])
    );
  }
}
