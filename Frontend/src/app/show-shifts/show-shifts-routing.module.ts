import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowShiftsPage } from './show-shifts.page';

const routes: Routes = [
  {
    path: '',
    component: ShowShiftsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowShiftsPageRoutingModule {}
