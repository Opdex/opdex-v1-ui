import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeEventComponent } from './stake-event.component';

describe('StakeEventComponent', () => {
  let component: StakeEventComponent;
  let fixture: ComponentFixture<StakeEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
