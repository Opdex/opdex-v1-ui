import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideEventComponent } from './provide-event.component';

describe('ProvideEventComponent', () => {
  let component: ProvideEventComponent;
  let fixture: ComponentFixture<ProvideEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvideEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
