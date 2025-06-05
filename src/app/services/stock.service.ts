import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api/watchlist';

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<any[]> {
    return this.http.get<{ message: string; data: any[] }>(`${this.apiUrl}/default`, { withCredentials: true }).pipe(
      map((response) => {
        if (!response || !response.data || response.data.length === 0) {
          console.warn('No stock data returned');
          return [];
        }
        return response.data;
      }),
      catchError((error) => {
        console.error('Error fetching stocks:', error);
        return throwError(() => error);
      })
    );
  }

  getWatchlistedStocks(): Observable<any[]> {
    return this.http
      .get<{ message: string; data: any[] }>(`${this.apiUrl}/favorites`, { withCredentials: true })
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error fetching watchlisted stocks:', error);
          return throwError(() => error);
        })
      );
  }


  addToWatchlist(stockId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/${stockId}`, {}, { withCredentials: true }).pipe(
      catchError(error => {
        console.error(`Error adding stock ${stockId} to watchlist:`, error);
        return throwError(() => error);
      })
    );
  }

  removeFromWatchlist(stockId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${stockId}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error(`Error removing stock ${stockId} from watchlist:`, error);
        return throwError(() => error);
      })
    );
  }
}
