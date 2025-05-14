import { Component, OnInit } from '@angular/core';
import { PortfolioService, Holding } from '../services/portfolio.services';
import {NgForOf, NgIf} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';

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

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    console.log('PortfolioComponent initialized');

    this.portfolioService.getHoldings(this.userId).subscribe({
      next: (data) => {
        console.log('Holdings fetched:', data); // 🔍 Debug log
        this.holdings = data;
      },
      error: (err) => {
        console.error('Error fetching portfolio:', err);
      }
    });
  }
}
