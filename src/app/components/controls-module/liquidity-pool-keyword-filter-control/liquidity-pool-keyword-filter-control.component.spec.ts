import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityPoolKeywordFilterControlComponent } from './liquidity-pool-keyword-filter-control.component';

describe('LiquidityPoolKeywordFilterControlComponent', () => {
  let component: LiquidityPoolKeywordFilterControlComponent;
  let fixture: ComponentFixture<LiquidityPoolKeywordFilterControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityPoolKeywordFilterControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityPoolKeywordFilterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
