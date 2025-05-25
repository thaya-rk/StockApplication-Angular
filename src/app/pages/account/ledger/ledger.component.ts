import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.services';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';  // Adjust path as needed

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    NgClass,
    DecimalPipe
  ],
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

  ledger: any[] = [];
  filter: 'ALL' | 'FUNDS' | 'STOCKS' = 'ALL';
  showAllTransactions = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadLedger();
  }

  loadLedger() {
    this.accountService.getLedger().subscribe({
      next: (data) => this.ledger = data,
      error: (err) => console.error('Error loading ledger:', err)
    });
  }

  filteredLedger(): any[] {
    if (this.filter === 'ALL') return this.ledger;
    if (this.filter === 'FUNDS') return this.ledger.filter(txn => txn.type === 'DEPOSIT' || txn.type === 'WITHDRAW');
    if (this.filter === 'STOCKS') return this.ledger.filter(txn => txn.type !== 'DEPOSIT' && txn.type !== 'WITHDRAW');
    return this.ledger;
  }

  filteredLedgerLimited(): any[] {
    return this.showAllTransactions ? this.filteredLedger() : this.filteredLedger().slice(0, 5);
  }
}
