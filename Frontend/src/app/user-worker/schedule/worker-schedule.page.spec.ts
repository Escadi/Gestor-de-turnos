import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerSchedulePage } from './worker-schedule.page';

describe('WorkerSchedulePage', () => {
    let component: WorkerSchedulePage;
    let fixture: ComponentFixture<WorkerSchedulePage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkerSchedulePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
