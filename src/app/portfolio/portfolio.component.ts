import { Component, OnInit } from '@angular/core';
import { PortfolioService, Holding } from '../services/portfolio.services';
import {NgForOf, NgIf} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';
import {BuySellRequest} from '../models/buy-sell-request.model';
import { BuySellService } from '../services/buy-sell.service';



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  imports: [
    NgForOf,
    NgIf,
    NavbarComponent
  ],
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  holdings: Holding[] = [];
  userId: number = 2;

  constructor(
    private portfolioService: PortfolioService,
    private buySellService :BuySellService
  ) {}

  ngOnInit(): void {
    console.log('PortfolioComponent initialized');


    this.portfolioService.getHoldings().subscribe({
      next: (data) => {
        console.log('Holdings fetched:', data);
        this.holdings = data;
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }
  buyStock(stockId: number) {
    const qtyStr = prompt('Enter quantity to buy:', '1');
    const quantity = qtyStr ? parseInt(qtyStr, 10) : 0;
    if (quantity > 0) {
      const request: BuySellRequest = { stockId, quantity };
      this.buySellService.buyStock(request).subscribe({
        next: () => alert('Stock bought successfully'),
        error: err => alert('Failed to buy stock: ' + err.message)
      });
    } else {
      alert('Invalid quantity');
    }
  }

  sellStock(stockId: number) {
    const qtyStr = prompt('Enter quantity to sell:', '1');
    const quantity = qtyStr ? parseInt(qtyStr, 10) : 0;
    if (quantity > 0) {
      const request: BuySellRequest = { stockId, quantity };
      this.buySellService.sellStock(request).subscribe({
        next: () => alert('Stock sold successfully'),
        error: err => alert('Failed to sell stock: ' + err.message)
      });
    } else {
      alert('Invalid quantity');
    }
  }
}
