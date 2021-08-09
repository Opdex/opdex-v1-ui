import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceValidationComponent } from './allowance-validation.component';

describe('AllowanceValidationComponent', () => {
  let component: AllowanceValidationComponent;
  let fixture: ComponentFixture<AllowanceValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowanceValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
