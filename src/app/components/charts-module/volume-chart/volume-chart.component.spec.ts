import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeChartComponent } from './volume-chart.component';

describe('VolumeChartComponent', () => {
  let component: VolumeChartComponent;
  let fixture: ComponentFixture<VolumeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolumeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
