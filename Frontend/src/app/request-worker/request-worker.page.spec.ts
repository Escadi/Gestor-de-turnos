import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestWorkerPage } from './request-worker.page';

describe('RequestWorkerPage', () => {
  let component: RequestWorkerPage;
  let fixture: ComponentFixture<RequestWorkerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
