import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserWorkerPage } from './user-worker.page';

describe('UserWorkerPage', () => {
    let component: UserWorkerPage;
    let fixture: ComponentFixture<UserWorkerPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(UserWorkerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
