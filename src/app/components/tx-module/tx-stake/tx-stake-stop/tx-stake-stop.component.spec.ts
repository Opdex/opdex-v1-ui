import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxStakeStopComponent } from './tx-stake-stop.component';

describe('TxStakeStopComponent', () => {
  let component: TxStakeStopComponent;
  let fixture: ComponentFixture<TxStakeStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxStakeStopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxStakeStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
