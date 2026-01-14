import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestWorkerPage } from './request-worker.page';

const routes: Routes = [
  {
    path: '',
    component: RequestWorkerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestWorkerPageRoutingModule {}
