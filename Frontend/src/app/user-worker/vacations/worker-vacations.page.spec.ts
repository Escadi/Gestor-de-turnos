import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerVacationsPage } from './worker-vacations.page';

describe('WorkerVacationsPage', () => {
    let component: WorkerVacationsPage;
    let fixture: ComponentFixture<WorkerVacationsPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkerVacationsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
