import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeIndicatorComponent } from './change-indicator.component';

describe('ChangeIndicatorComponent', () => {
  let component: ChangeIndicatorComponent;
  let fixture: ComponentFixture<ChangeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
