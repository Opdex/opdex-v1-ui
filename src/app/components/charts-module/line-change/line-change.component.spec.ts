import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChangeComponent } from './line-change.component';

describe('LineChangeComponent', () => {
  let component: LineChangeComponent;
  let fixture: ComponentFixture<LineChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
