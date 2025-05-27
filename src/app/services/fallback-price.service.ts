import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface FallbackPrice {
  symbol: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class FallbackPriceService {
  private readonly apiKey = 'c88a9e2d3adc4fbdae16a6c195c29fc5';
  private readonly baseUrl = 'https://api.twelvedata.com/price';

  constructor(private http: HttpClient) {}

  getPrices(symbols: string[]): Observable<FallbackPrice[]> {
    if (!symbols || symbols.length === 0) {
      return of([]);
    }

    const requests = symbols.map(symbol =>
      this.http.get<any>(`${this.baseUrl}?symbol=${symbol}&apikey=${this.apiKey}`).pipe(
        map(response => ({
          symbol,
          price: parseFloat(response.price)
        })),
        catchError(error => {
          console.error(`Error fetching price for ${symbol}:`, error);
          return of({ symbol, price: NaN }); // NaN indicates an invalid/unavailable price
        })
      )
    );

    return forkJoin(requests);
  }
}
