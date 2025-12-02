import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowShiftsPage } from './show-shifts.page';

describe('ShowShiftsPage', () => {
  let component: ShowShiftsPage;
  let fixture: ComponentFixture<ShowShiftsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowShiftsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
