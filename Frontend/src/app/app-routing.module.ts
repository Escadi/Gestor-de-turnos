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
  },  {
    path: 'add-worker',
    loadChildren: () => import('./add-worker/add-worker.module').then( m => m.AddWorkerPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
