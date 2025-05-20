import { Component, OnInit } from '@angular/core';
import { PortfolioService, Holding } from '../../services/portfolio.services';
import {DecimalPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {NavbarComponent} from '../../navbar/navbar.component';
import {BuySellRequest} from '../../models/buy-sell-request.model';
import { BuySellService } from '../../services/buy-sell.service';
import {HoldingsComponent} from '../holdings/holdings.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  imports: [
    NgForOf,
    NgIf,
    NavbarComponent,
    DecimalPipe,
    NgStyle,
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

  get portfolioValue(): number {
    return this.holdings.reduce((sum, h) => sum + h.currentValue, 0);
  }

  get portfolioGain(): number {
    return this.holdings.reduce(
      (gain, h) => gain + (h.currentPrice - h.avgBuyPrice) * h.quantity,
      0
    );
  }

  get portfolioGainPercent(): number {
    const totalInvestment = this.holdings.reduce(
      (sum, h) => sum + h.avgBuyPrice * h.quantity,
      0
    );
    return totalInvestment ? (this.portfolioGain / totalInvestment) * 100 : 0;
  }

  getProfitLoss(holding: Holding): number {
    return (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
  }


}
