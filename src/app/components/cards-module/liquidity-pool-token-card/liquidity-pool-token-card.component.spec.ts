import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityPoolTokenCardComponent } from './liquidity-pool-token-card.component';

describe('LiquidityPoolTokenCardComponent', () => {
  let component: LiquidityPoolTokenCardComponent;
  let fixture: ComponentFixture<LiquidityPoolTokenCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityPoolTokenCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityPoolTokenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
