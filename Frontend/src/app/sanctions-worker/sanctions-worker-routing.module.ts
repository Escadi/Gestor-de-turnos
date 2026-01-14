import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SanctionsWorkerPage } from './sanctions-worker.page';

const routes: Routes = [
  {
    path: '',
    component: SanctionsWorkerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SanctionsWorkerPageRoutingModule {}
