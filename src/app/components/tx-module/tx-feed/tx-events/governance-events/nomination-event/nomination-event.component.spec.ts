import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationEventComponent } from './nomination-event.component';

describe('NominationEventComponent', () => {
  let component: NominationEventComponent;
  let fixture: ComponentFixture<NominationEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominationEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominationEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
