import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkerProfilePage } from './worker-profile.page';

const routes: Routes = [
    {
        path: '',
        component: WorkerProfilePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkerProfilePageRoutingModule { }
