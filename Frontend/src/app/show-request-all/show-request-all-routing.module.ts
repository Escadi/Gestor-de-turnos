import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowRequestAllPage } from './show-request-all.page';

const routes: Routes = [
  {
    path: '',
    component: ShowRequestAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowRequestAllPageRoutingModule {}
