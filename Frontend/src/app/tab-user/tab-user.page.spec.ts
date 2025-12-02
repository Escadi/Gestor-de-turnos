import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabUserPage } from './tab-user.page';

describe('TabUserPage', () => {
  let component: TabUserPage;
  let fixture: ComponentFixture<TabUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
