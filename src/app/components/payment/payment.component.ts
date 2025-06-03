import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { BankService } from '../../services/bank.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {AccountService} from '../../services/account.services';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  banksB2C: any[] = [];
  banksB2B: any[] = [];
  bankTypes = [
    { name: 'Retail Banking', code: '01' },
    { name: 'Corporate Banking', code: '02' }
  ];
  @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

  selectedBankType: string = '01';
  selectedBank: string = '';
  loading: boolean = false;

  formData: any = {
    amount: '',
    buyerName: '',
    email: '',
    sellerOrderNo: '',
    merchantName: 'MOBI ASIA SDN. BHD.',
  };

  constructor(private bankService: BankService,
              private accountService:AccountService,
              private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.bankService.getBankList().subscribe(res => {
      this.banksB2C = res.responseDataB2C.bankList;
      this.banksB2B = res.responseDataB2B.bankList;
    });

    this.accountService.getProfile().subscribe(profile => {
      this.formData.buyerName = profile.fullName;
      this.formData.email = profile.email;
    });

    this.route.queryParams.subscribe(params => {
      this.formData.amount = params['amount'];
    });

    this.generateSellerOrderNo();
  }

  generateSellerOrderNo() {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0'); // months 0-11
    const dd = now.getDate().toString().padStart(2, '0');
    // Optional: you can append time or random number to ensure uniqueness
    this.formData.sellerOrderNo = `${yyyy}${mm}${dd}`;
  }
  submitForm() {
    this.loading = true;
    // Before submit, you can do validations or modify hidden fields like checksum
    this.paymentForm.nativeElement.submit();
  }
}
