import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerClockPage } from './worker-clock.page';

describe('WorkerClockPage', () => {
    let component: WorkerClockPage;
    let fixture: ComponentFixture<WorkerClockPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkerClockPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
