import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxAddLiquidityComponent } from './tx-box-add-liquidity.component';

describe('TxBoxAddLiquidityComponent', () => {
  let component: TxBoxAddLiquidityComponent;
  let fixture: ComponentFixture<TxBoxAddLiquidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxAddLiquidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxAddLiquidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
