import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'payment-status',
  templateUrl: './payment-status.component.html',
  imports: [
    NgIf,
    RouterLink
  ],
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  status: string | null = null;
  orderNo: string | null = null;
  transactionId: string | null = null;
  message: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Read query parameters from URL (e.g. ?status=success&orderNo=123&transactionId=abc)
    this.route.queryParamMap.subscribe(params => {
      this.status = params.get('status');
      this.orderNo = params.get('orderNo');
      this.transactionId = params.get('transactionId');

      if (this.status === 'success') {
        this.message = 'Payment Successful! Thank you for your Transaction.';
      } else if (this.status === 'failed') {
        this.message = 'Payment Failed. Please try again or contact support.';
      } else {
        this.message = 'Payment status unknown.';
      }
    });
  }
}
