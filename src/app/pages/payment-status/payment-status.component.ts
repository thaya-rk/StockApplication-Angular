import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';
import { FPX_CODE_MSG } from '../../utils/fpx-code-map';


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
  code: string | null = null;          // <-- new
  message = '';
  fpxMessage: string = '';



  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.status        = params.get('status');
      this.orderNo       = params.get('orderNo');
      this.transactionId = params.get('transactionId');
      this.code          = params.get('code');

      // Human-readable FPX message
      this.fpxMessage = this.code && FPX_CODE_MSG[this.code]
        ? FPX_CODE_MSG[this.code]
        : 'Unknown FPX Status';


      if (this.status === 'success') {
        this.message = 'Payment Successful! Thank you for your transaction.';
      } else if (this.status === 'failed') {
        this.message = 'Payment Failed. Please try again or contact support.';
      } else {
        this.message = 'Payment status unknown.';
      }
    });
  }
}
