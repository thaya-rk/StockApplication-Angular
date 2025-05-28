import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend, NgApexchartsModule
} from 'ng-apexcharts';
import {CommonModule} from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-portfolio-stacked-bar-chart',
  templateUrl: './portfolio-stacked-bar-chart.component.html',
  imports: [
    ChartComponent,
    NgApexchartsModule,
    CommonModule
  ],
  styleUrls: ['./portfolio-stacked-bar-chart.component.css']
})
export class PortfolioStackedBarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchHoldings();
  }

  fetchHoldings(): void {
    this.http.get<any[]>('http://localhost:8080/api/portfolio/holdings',{withCredentials:true}).subscribe(data => {
      const categories = data.map(item => item.stockName);
      const invested = data.map(item => item.quantity * item.avgBuyPrice);
      const profit = data.map(item => (item.currentPrice - item.avgBuyPrice) * item.quantity);

      this.chartOptions = {
        series: [
          {
            name: 'Invested Value',
            data: invested
          },
          {
            name: 'Profit',
            data: profit
          }
        ],
        chart: {
          type: 'bar',
          height: 210,
          width:400,
          stacked: true,

        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          categories: categories
        },
        stroke: {
          show: true,
          width:1,
          colors: ['#fff']
        },
        title: {
          text: ''
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: val => '₹' + val.toFixed(2)
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center'
        }
      };
    });
  }
}
