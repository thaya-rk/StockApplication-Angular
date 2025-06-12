import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: any[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [ChartComponent, NgIf],
  templateUrl: './stock-chart.component.html'
})
export class StockChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    const apiUrl = 'http://localhost:8080/nse/getCandle/NIFTY 50';

    this.http.get<any>(apiUrl).subscribe((response) => {
      const graphData = response?.grapthData || [];

      const formattedData = graphData.map(([timestamp, price]: [number, number]) => {
        return {
          x: new Date(timestamp),
          y: price
        };
      });

      this.chartOptions = {
        series: [
          {
            name: 'NIFTY 50 Price',
            data: formattedData
          }
        ],
        chart: {
          type: 'area',
          height: 300,
          width:900,
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        title: {
          text: 'NIFTY 50 – Intraday Price Movement (1 Day)',
          align: 'left'
        },
        subtitle: {
          text: 'Live market data',
          align: 'left'
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
            format: 'HH:mm'
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        }
      };
    });
  }
}
