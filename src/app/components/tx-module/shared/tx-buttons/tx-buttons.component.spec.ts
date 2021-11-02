import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxButtonsComponent } from './tx-buttons.component';

describe('TxButtonsComponent', () => {
  let component: TxButtonsComponent;
  let fixture: ComponentFixture<TxButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
