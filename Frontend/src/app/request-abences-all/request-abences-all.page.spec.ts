import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestAbencesAllPage } from './request-abences-all.page';

describe('RequestAbencesAllPage', () => {
  let component: RequestAbencesAllPage;
  let fixture: ComponentFixture<RequestAbencesAllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAbencesAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
