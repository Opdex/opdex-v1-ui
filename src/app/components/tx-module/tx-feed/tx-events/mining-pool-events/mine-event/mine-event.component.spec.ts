import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineEventComponent } from './mine-event.component';

describe('MineEventComponent', () => {
  let component: MineEventComponent;
  let fixture: ComponentFixture<MineEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MineEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MineEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
