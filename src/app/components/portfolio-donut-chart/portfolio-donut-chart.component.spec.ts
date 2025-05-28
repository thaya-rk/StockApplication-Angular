import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDonutChartComponent } from './portfolio-donut-chart.component';

describe('PortfolioDonutChartComponent', () => {
  let component: PortfolioDonutChartComponent;
  let fixture: ComponentFixture<PortfolioDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioDonutChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
