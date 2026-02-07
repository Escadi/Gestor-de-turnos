import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkerActivityPage } from './worker-activity.page';

const routes: Routes = [
    {
        path: '',
        component: WorkerActivityPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkerActivityPageRoutingModule { }
