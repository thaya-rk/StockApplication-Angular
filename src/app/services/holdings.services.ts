import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Holding} from '../models/portfolio.model';

@Injectable({
  providedIn:'root'
})
export class HoldingsServices{

  private baseUrl = 'http://localhost:8080/api/portfolio';

  constructor(private http: HttpClient) {}

  getHoldings(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${this.baseUrl}/holdings`, {
      withCredentials: true
    });
  }
}
