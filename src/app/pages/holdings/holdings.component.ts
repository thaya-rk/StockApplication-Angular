import { Component } from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {HoldingsServices} from '../../services/holdings.services';
import {Holding} from '../../models/portfolio.model';
import {DecimalPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {PortfolioDonutChartComponent} from "../../components/portfolio-donut-chart/portfolio-donut-chart.component";
import {
  PortfolioStackedBarChartComponent
} from '../../components/portfolio-stacked-bar-chart/portfolio-stacked-bar-chart.component';


@Component({
  selector: 'app-holdings',
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    DecimalPipe,
    PortfolioDonutChartComponent,
    PortfolioStackedBarChartComponent
  ],
  templateUrl: './holdings.component.html',
  styleUrl: './holdings.component.css'
})
export class HoldingsComponent {

  holdings: Holding[] = [];


  constructor(
    private holdingService:HoldingsServices) {
  }
  ngOnInit(): void {
    console.log('HoldingsComponent initialized');


    this.holdingService.getHoldings().subscribe({
      next: (data) => {
        console.log('Holdings fetched:', data);
        this.holdings = data;
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }

  getTotalInvestment(): number {
    return this.holdings.reduce((acc, holding) => {
      return acc + (holding.avgBuyPrice * holding.quantity);
    }, 0);
  }

  getCurrentValue(): number {
    return this.holdings.reduce((acc, holding) => {
      return acc + holding.currentValue;
    }, 0);
  }
  getProfitLoss(holding: Holding): number {
    return (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
  }
}
