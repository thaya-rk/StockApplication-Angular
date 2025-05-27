import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip, ChartComponent
} from 'ng-apexcharts';

@Component({
  selector: 'app-real-time-chart',
  templateUrl: './real-time-chart.component.html',
  imports: [
    ChartComponent
  ],
  styleUrls: ['./real-time-chart.component.css']
})
export class RealTimeChartComponent implements OnInit {
  @Input() symbol: string = 'BTC/USD';
  @Input() maxPoints: number = 50;

  public series: ApexAxisChartSeries = [{ name: this.symbol, data: [] }];
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  private priceData: [number, number][] = []; // [timestamp, price]

  ngOnInit(): void {
    this.chart = {
      type: 'area',
      height: 200,
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    };

    this.dataLabels = { enabled: false };
    this.markers = { size: 0 };
    this.title = { text: `Live Price Chart: ${this.symbol}`, align: 'left' };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: (val) => val.toFixed(2)
      },
      title: { text: 'Price (USD)' }
    };
    this.xaxis = { type: 'datetime' };
    this.tooltip = {
      shared: false,
      x: { format: 'dd MMM yyyy HH:mm:ss' },
      y: {
        formatter: (val) => val.toFixed(2)
      }
    };
  }

  addPricePoint(price: number, timestamp: number) {
    const point: [number, number] = [timestamp * 1000, price]; // timestamp in ms
    this.priceData.push(point);

    if (this.priceData.length > this.maxPoints) {
      this.priceData.shift();
    }

    this.series = [{ name: this.symbol, data: [...this.priceData] }];
  }
}
