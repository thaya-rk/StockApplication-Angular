// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, Stock } from '../../services/admin.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stocks: Stock[] = [];
  newStock = {
    companyName: '',
    stockPrice: 0,
    tickerSymbol: '',
    exchange: '',
    sector: '',
    ipoQty: 0,
    imageURL: '',
    desc: ''
  };

  selectedStock: Stock | null = null;
  updatedPrice: number = 0;

  constructor(private adminService: AdminService,private router: Router) {}

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.adminService.getAllStocks().subscribe(data => {
      this.stocks = data;
    });
  }

  addStock() {
    this.adminService.addStock(this.newStock as Stock).subscribe(() => {
      this.loadStocks();
      this.resetNewStock();
    });
  }

  selectStock(stock: Stock) {
    this.selectedStock = stock;
    this.updatedPrice = stock.stockPrice;
  }

  updateStock() {
    if (this.selectedStock) {
      this.adminService.updateStock(this.selectedStock.stockId, this.updatedPrice).subscribe(() => {
        this.loadStocks();
        this.selectedStock = null;
      });
    }
  }


  deleteStock(stockId: number) {
    this.adminService.deleteStock(stockId).subscribe(() => {
      this.loadStocks();
    });
  }



  resetNewStock() {
    this.newStock = {
      companyName: '',
      stockPrice: 0,
      tickerSymbol: '',
      exchange: '',
      sector: '',
      ipoQty: 0,
      imageURL: '',
      desc: ''
    };
  }

  logout(): void {
    this.adminService.logout().subscribe({
      next: () => {
        // Navigate to login after successful logout
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed, redirecting anyway.', error);
        this.router.navigate(['/login']);
      }
    });
  }


}
