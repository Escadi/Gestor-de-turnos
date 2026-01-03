import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkerClockPage } from './worker-clock.page';

const routes: Routes = [
    {
        path: '',
        component: WorkerClockPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkerClockPageRoutingModule { }
