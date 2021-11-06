import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageAmountButtonsComponent } from './percentage-amount-buttons.component';

describe('PercentageAmountButtonsComponent', () => {
  let component: PercentageAmountButtonsComponent;
  let fixture: ComponentFixture<PercentageAmountButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageAmountButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageAmountButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
