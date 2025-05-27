import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.services';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';  // Adjust path as needed

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    NgClass,
    DecimalPipe,
    FormsModule
  ],
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

  ledger: any[] = [];
  filter: 'ALL' | 'FUNDS' | 'STOCKS' = 'ALL';
  showAllTransactions = false;

  fromDate: string | null = null;
  toDate: string | null = null;

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
    let filtered = this.ledger;

    // Type filter
    if (this.filter === 'FUNDS') {
      filtered = filtered.filter(txn => txn.type === 'DEPOSIT' || txn.type === 'WITHDRAW');
    } else if (this.filter === 'STOCKS') {
      filtered = filtered.filter(txn => txn.type !== 'DEPOSIT' && txn.type !== 'WITHDRAW');
    }

    // Date range filter
    if (this.fromDate) {
      const from = new Date(this.fromDate);
      filtered = filtered.filter(txn => new Date(txn.transactionDate) >= from);
    }

    if (this.toDate) {
      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999); // include end of day
      filtered = filtered.filter(txn => new Date(txn.transactionDate) <= to);
    }

    return filtered;
  }

  applyDateFilter() {
    this.showAllTransactions = false;
  }

  clearDateFilter() {
    this.fromDate = null;
    this.toDate = null;
    this.showAllTransactions = false;
  }


  filteredLedgerLimited(): any[] {
    return this.showAllTransactions ? this.filteredLedger() : this.filteredLedger().slice(0, 5);
  }

  generateReport() {
    const ledgerData = this.filteredLedger();

    if (!ledgerData.length) {
      alert('No transactions to export for this filter.');
      return;
    }

    const headers = ['Date', 'Type', 'Company', 'Exchange', 'Price', 'Qty', 'Charges', 'Total Amount', 'Status'];
    const rows = ledgerData.map(txn => {
      const isStockTxn = txn.type !== 'DEPOSIT' && txn.type !== 'WITHDRAW';
      return [
        new Date(txn.transactionDate).toLocaleDateString(),
        txn.type,
        isStockTxn ? txn.stock?.companyName || '' : '',
        isStockTxn ? txn.stock?.exchange || '' : '',
        isStockTxn ? txn.stock?.stockPrice?.toFixed(2) || '' : '',
        isStockTxn ? txn.qty || '' : '',
        txn.transactionCharges?.toFixed(2) || '',
        txn.totalAmount?.toFixed(2) || '',
        txn.status
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ledger_Report_${this.filter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



}
