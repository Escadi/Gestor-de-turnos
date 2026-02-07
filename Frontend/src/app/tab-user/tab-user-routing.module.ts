import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabUserPage } from './tab-user.page';

const routes: Routes = [
  {
    path: '',
    component: TabUserPage,
    children: [
      {
        path: 'clock',
        loadChildren: () => import('../user-worker/clock/worker-clock.module').then(m => m.WorkerClockPageModule)
      },
      {
        path: 'show-shifts',
        loadChildren: () => import('../show-shifts/show-shifts.module').then(m => m.ShowShiftsPageModule)
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
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'manage',
        loadChildren: () => import('../manage-hub/manage-hub.module').then(m => m.ManageHubPageModule)
      },
      // Gestión de empleados dentro de tabs
      {
        path: 'my-workers',
        loadChildren: () => import('../my-workers/my-workers.module').then(m => m.MyWorkersPageModule)
      },
      {
        path: 'shifts',
        loadChildren: () => import('../shifts/shifts.module').then(m => m.ShiftsPageModule)
      },
      {
        path: 'workers-details-crud',
        loadChildren: () => import('../workers-details-crud/workers-details-crud.module').then(m => m.WorkersDetailsCrudPageModule)
      },
      {
        path: 'worker-activity',
        loadChildren: () => import('../worker-activity/worker-activity.module').then(m => m.WorkerActivityPageModule)
      },
      {
        path: '',
        redirectTo: 'clock',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabUserPageRoutingModule { }
