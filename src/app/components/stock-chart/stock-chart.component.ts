import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import {NgIf} from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
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
    const apiUrl =
      'https://api.twelvedata.com/time_series?symbol=BTC/USD&interval=1min&apikey=c88a9e2d3adc4fbdae16a6c195c29fc5';

    this.http.get<any>(apiUrl).subscribe((response) => {
      if (response?.values?.length) {
        const sorted = response.values.sort(
          (a: any, b: any) =>
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );

        const closeData = sorted.map((item: any) => {
          const usDate = new Date(item.datetime + ' UTC');
          const istString = usDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          const istDate = new Date(istString);

          return {
            x: istDate,
            y: parseFloat(item.close)
          };
        });

        this.chartOptions = {
          series: [
            {
              name: 'Close Price',
              data: closeData
            }
          ],
          chart: {
            type: 'line',
            height: 200
          },
          xaxis: {
            type: 'datetime',
            labels: {
              format: 'dd MMM HH:mm',
              datetimeUTC: false
            }
          },
          title: {
            text: 'Bitcoin Live Chart (1-min interval in IST)'
          }
        };
      }
    });
  }
}
