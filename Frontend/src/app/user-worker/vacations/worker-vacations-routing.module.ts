import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkerVacationsPage } from './worker-vacations.page';

const routes: Routes = [
    {
        path: '',
        component: WorkerVacationsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkerVacationsPageRoutingModule { }
