import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbencesWorkerPage } from './abences-worker.page';

const routes: Routes = [
  {
    path: '',
    component: AbencesWorkerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbencesWorkerPageRoutingModule {}
