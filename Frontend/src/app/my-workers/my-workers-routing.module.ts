import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyWorkersPage } from './my-workers.page';

const routes: Routes = [
  {
    path: '',
    component: MyWorkersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWorkersPageRoutingModule {}
