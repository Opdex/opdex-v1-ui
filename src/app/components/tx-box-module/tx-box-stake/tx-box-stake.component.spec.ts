import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxStakeComponent } from './tx-box-stake.component';

describe('TxBoxStakeComponent', () => {
  let component: TxBoxStakeComponent;
  let fixture: ComponentFixture<TxBoxStakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxStakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
