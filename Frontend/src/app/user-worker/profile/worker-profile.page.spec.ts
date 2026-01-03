import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerProfilePage } from './worker-profile.page';

describe('WorkerProfilePage', () => {
    let component: WorkerProfilePage;
    let fixture: ComponentFixture<WorkerProfilePage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkerProfilePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
