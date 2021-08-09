import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineSliderComponent } from './deadline-slider.component';

describe('DeadlineSliderComponent', () => {
  let component: DeadlineSliderComponent;
  let fixture: ComponentFixture<DeadlineSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadlineSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
