import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxBoxMineComponent } from './tx-box-mine.component';

describe('TxBoxMineComponent', () => {
  let component: TxBoxMineComponent;
  let fixture: ComponentFixture<TxBoxMineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxBoxMineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxBoxMineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
