import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SanctionsWorkerPage } from './sanctions-worker.page';

describe('SanctionsWorkerPage', () => {
  let component: SanctionsWorkerPage;
  let fixture: ComponentFixture<SanctionsWorkerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SanctionsWorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
