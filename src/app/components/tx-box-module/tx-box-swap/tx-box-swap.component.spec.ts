import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxSwapComponent } from './tx-box-swap.component';

describe('TxBoxSwapComponent', () => {
  let component: TxBoxSwapComponent;
  let fixture: ComponentFixture<TxBoxSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
