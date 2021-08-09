import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolPreviewComponent } from './pool-preview.component';

describe('PoolPreviewComponent', () => {
  let component: PoolPreviewComponent;
  let fixture: ComponentFixture<PoolPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
