import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.services';
import {FormsModule} from '@angular/forms';
import {DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-funds',
  templateUrl: './funds.component.html',
  imports: [
    FormsModule,
    DecimalPipe,
    NgIf
  ],
  styleUrls: ['./funds.component.css']
})
export class FundsComponent implements OnInit {
  balance: number = 0;
  amount: number = 0;
  message: string = '';
  error: string = '';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadBalance();
  }

  loadBalance() {
    this.accountService.getBalance().subscribe({
      next: res => this.balance = res,
      error: () => this.error = 'Failed to load balance'
    });
  }

  deposit() {
    this.clearMessages();

    if (!this.amount || this.amount <= 0) {
      this.error = 'Enter a valid amount';
      return;
    }

    this.accountService.deposit(this.amount).subscribe({
      next: () => {
        this.message = 'Deposit successful';
        this.loadBalance();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Deposit failed';
      }
    });
  }

  withdraw() {
    this.clearMessages();

    if (!this.amount || this.amount <= 0) {
      this.error = 'Please enter a valid amount to withdraw.';
      return;
    }

    if (this.amount < 100) {
      this.error = 'Minimum withdrawal amount is ₹100.';
      return;
    }

    if (this.amount > this.balance) {
      this.error = 'Cannot withdraw: Insufficient balance';
      return;
    }

    this.accountService.withdraw(this.amount).subscribe({
      next: () => {
        this.message = 'Withdraw successful';
        this.loadBalance();
      },
      error: err => { this.error = err.error || 'Withdraw failed'; }
    });
  }

  clearMessages() {
    this.message = '';
    this.error = '';
  }
}
