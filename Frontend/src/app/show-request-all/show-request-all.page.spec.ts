import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowRequestAllPage } from './show-request-all.page';

describe('ShowRequestAllPage', () => {
  let component: ShowRequestAllPage;
  let fixture: ComponentFixture<ShowRequestAllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRequestAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
