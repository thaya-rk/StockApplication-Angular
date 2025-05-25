import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.services';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [
    FormsModule,
    NavbarComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class AccountComponent implements OnInit {
  user: any = {};
  balance: number = 0;
  amount: number = 0;
  message: string = '';
  error: string = '';
  ledger: any[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadProfile();
      this.loadBalance();
    this.loadLedger();
  }

  loadProfile() {
    this.accountService.getProfile().subscribe({
      next: res => {
        console.log("✅ Profile loaded:", res);
        this.user = res;
      },
      error: err => {
        console.error("❌ Failed to load profile", err);
        this.error = 'Failed to load profile';
      }
    });
  }


  loadBalance() {
    this.accountService.getBalance().subscribe({
      next: res => this.balance = res,
      error: () => this.error = 'Failed to load balance'
    });
  }

  loadLedger() {
    this.accountService.getLedger().subscribe({
      next: res => {
        console.log("✅ ledger:", res);

        this.ledger = res
      },
      error: () => this.error = 'Failed to load ledger'

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
        this.loadLedger();
      },
      error: (err) => {
        console.error('Deposit error:', err);
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

    if (this.amount <= 0) {
      this.error = 'Please enter a valid amount';
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
        this.loadLedger();

      },
      error: err => {this.error = err.error || 'Withdraw failed';}

    });
  }


  clearMessages() {
    this.message = '';
    this.error = '';
  }

  filter: 'ALL' | 'FUNDS' | 'STOCKS' = 'ALL';

  // ...

  shouldDisplay(type: string): boolean {
    if (this.filter === 'ALL') return true;
    if (this.filter === 'FUNDS') return type === 'DEPOSIT' || type === 'WITHDRAW';
    if (this.filter === 'STOCKS') return type === 'BUY' || type === 'SELL';
    return false;
  }

  filteredLedger() {
    return this.ledger.filter(txn => this.shouldDisplay(txn.type));
  }

  showAllTransactions = false;

  filteredLedgerLimited() {
    const all = this.filteredLedger();
    return this.showAllTransactions ? all : all.slice(0, 5);
  }

}
