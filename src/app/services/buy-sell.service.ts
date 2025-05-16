import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BuySellRequest} from '../models/buy-sell-request.model';

@Injectable({
  providedIn:"root"
})

export class BuySellService{
  private baseUrl='http://localhost:8080/api/portfolio';

  constructor(private http:HttpClient) {}

  buyStock(request:BuySellRequest){
    return this.http.post(`${this.baseUrl}/buy`,request,{withCredentials:true});

  }

  sellStock(request:BuySellRequest) {
    return this.http.post(`${this.baseUrl}/sell`, request,{withCredentials:true});
  }
}
