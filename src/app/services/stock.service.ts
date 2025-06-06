import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api/watchlist/default';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true }).pipe(
      map((stocks: any[]) => {
        if (!stocks || stocks.length === 0) {
          console.warn('No stock data returned from API');
          return [];
        }
        return stocks;
      }),
      catchError(error => {
        console.error('Error fetching stocks:', error);
        return throwError(() => error);
      })
    );
  }
}
