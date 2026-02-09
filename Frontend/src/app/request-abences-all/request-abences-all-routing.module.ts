import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestAbencesAllPage } from './request-abences-all.page';

const routes: Routes = [
  {
    path: '',
    component: RequestAbencesAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAbencesAllPageRoutingModule {}
