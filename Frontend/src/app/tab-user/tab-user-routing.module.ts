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
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabUserPageRoutingModule { }
