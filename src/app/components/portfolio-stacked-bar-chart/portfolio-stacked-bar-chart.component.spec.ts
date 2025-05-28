import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioStackedBarChartComponent } from './portfolio-stacked-bar-chart.component';

describe('PortfolioStackedBarChartComponent', () => {
  let component: PortfolioStackedBarChartComponent;
  let fixture: ComponentFixture<PortfolioStackedBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioStackedBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioStackedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
