import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tab-user',
    loadChildren: () => import('./tab-user/tab-user.module').then(m => m.TabUserPageModule)
  },
  {
    path: 'shifts',
    loadChildren: () => import('./shifts/shifts.module').then(m => m.ShiftsPageModule)
  },
  {
    path: 'my-workers',
    loadChildren: () => import('./my-workers/my-workers.module').then(m => m.MyWorkersPageModule)
  },
  {
    path: 'workers-details-crud',
    loadChildren: () => import('./workers-details-crud/workers-details-crud.module').then(m => m.WorkersDetailsCrudPageModule)
  },
  {
    path: 'user-worker',
    loadChildren: () => import('./user-worker/user-worker.module').then(m => m.UserWorkerPageModule)
  },
  {
    path: 'add-worker',
    loadChildren: () => import('./add-worker/add-worker.module').then(m => m.AddWorkerPageModule)
  },
  {
    path: 'request-worker',
    loadChildren: () => import('./request-worker/request-worker.module').then(m => m.RequestWorkerPageModule)
  },
  {
    path: 'sanctions-worker',
    loadChildren: () => import('./sanctions-worker/sanctions-worker.module').then(m => m.SanctionsWorkerPageModule)
  },
  {
    path: 'abences-worker',
    loadChildren: () => import('./abences-worker/abences-worker.module').then(m => m.AbencesWorkerPageModule)
  },
  {
    path: 'request-details',
    loadChildren: () => import('./request-details/request-details.module').then(m => m.RequestDetailsPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
