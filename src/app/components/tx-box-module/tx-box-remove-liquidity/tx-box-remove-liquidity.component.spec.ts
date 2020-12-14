import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxRemoveLiquidityComponent } from './tx-box-remove-liquidity.component';

describe('TxBoxRemoveLiquidityComponent', () => {
  let component: TxBoxRemoveLiquidityComponent;
  let fixture: ComponentFixture<TxBoxRemoveLiquidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxRemoveLiquidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxRemoveLiquidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
