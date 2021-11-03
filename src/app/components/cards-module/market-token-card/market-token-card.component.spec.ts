import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTokenCardComponent } from './market-token-card.component';

describe('MarketTokenCardComponent', () => {
  let component: MarketTokenCardComponent;
  let fixture: ComponentFixture<MarketTokenCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketTokenCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTokenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
