import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkersDetailsCrudPage } from './workers-details-crud.page';

describe('WorkersDetailsCrudPage', () => {
  let component: WorkersDetailsCrudPage;
  let fixture: ComponentFixture<WorkersDetailsCrudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkersDetailsCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
