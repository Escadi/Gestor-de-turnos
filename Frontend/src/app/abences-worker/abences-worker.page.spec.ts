import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbencesWorkerPage } from './abences-worker.page';

describe('AbencesWorkerPage', () => {
  let component: AbencesWorkerPage;
  let fixture: ComponentFixture<AbencesWorkerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AbencesWorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
