import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUpdateModalComponent } from './app-update-modal.component';

describe('AppUpdateModalComponent', () => {
  let component: AppUpdateModalComponent;
  let fixture: ComponentFixture<AppUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
