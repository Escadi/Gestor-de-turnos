import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWorkerPage } from './add-worker.page';

const routes: Routes = [
  {
    path: '',
    component: AddWorkerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWorkerPageRoutingModule {}
