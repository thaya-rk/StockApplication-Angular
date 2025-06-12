import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPriceTestComponent } from './stock-price-test.component';

describe('StockPriceTestComponent', () => {
  let component: StockPriceTestComponent;
  let fixture: ComponentFixture<StockPriceTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockPriceTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPriceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
