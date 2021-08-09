import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxStakeComponent } from './tx-stake.component';

describe('TxStakeComponent', () => {
  let component: TxStakeComponent;
  let fixture: ComponentFixture<TxStakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxStakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
