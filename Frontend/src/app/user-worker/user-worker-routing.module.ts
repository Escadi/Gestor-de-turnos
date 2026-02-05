import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserWorkerPage } from './user-worker.page';

const routes: Routes = [
    {
        path: '',
        component: UserWorkerPage,
        children: [
            {
                path: 'worker-profile',
                loadChildren: () => import('./profile/worker-profile.module').then(m => m.WorkerProfilePageModule)
            },
            {
                path: 'worker-clock',
                loadChildren: () => import('./clock/worker-clock.module').then(m => m.WorkerClockPageModule)
            },
            {
                path: 'worker-schedule',
                loadChildren: () => import('./schedule/worker-schedule.module').then(m => m.WorkerSchedulePageModule)
            },
            {
                path: 'requests',
                loadChildren: () => import('../request-worker/request-worker.module').then(m => m.RequestWorkerPageModule)
            },
            {
                path: 'abences',
                loadChildren: () => import('../abences-worker/abences-worker.module').then(m => m.AbencesWorkerPageModule)
            },
            {
                path: '',
                redirectTo: 'worker-profile',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserWorkerPageRoutingModule { }
