// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ChecksumRequest {
  amount: string;
  sellerOrderNo: string;
  subMID: string;
  mid: string;
  tid: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  generateChecksum(payload: ChecksumRequest): Observable<{ checksum: string }> {
    return this.http.post<{ checksum: string }>(`${this.apiUrl}/generate-checksum`, payload);
  }
}
