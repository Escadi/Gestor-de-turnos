import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyWorkersPage } from './my-workers.page';

describe('MyWorkersPage', () => {
  let component: MyWorkersPage;
  let fixture: ComponentFixture<MyWorkersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
