import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultProposalsTableComponent } from './vault-proposals-table.component';

describe('VaultProposalsTableComponent', () => {
  let component: VaultProposalsTableComponent;
  let fixture: ComponentFixture<VaultProposalsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultProposalsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultProposalsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
