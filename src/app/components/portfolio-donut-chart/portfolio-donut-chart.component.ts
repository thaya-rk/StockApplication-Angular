import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-portfolio-donut-chart',
  standalone: true,
  templateUrl: './portfolio-donut-chart.component.html',
  imports: [CommonModule, NgApexchartsModule],
  styleUrls: ['./portfolio-donut-chart.component.css']
})
export class PortfolioDonutChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'donut',
      width: '80%',

    },
    labels: [],
    responsive: [
      {
        breakpoint: 200,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchHoldingsData();
  }

  fetchHoldingsData(): void {
    this.http.get<any[]>('http://localhost:8080/api/portfolio/holdings',{withCredentials:true}).subscribe(data => {
      const series = data.map(holding => holding.currentValue);
      const labels = data.map(holding => holding.stockName);

      this.chartOptions.series = series;
      this.chartOptions.labels = labels;
    });
  }
}
