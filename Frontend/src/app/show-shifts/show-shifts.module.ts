import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowShiftsPageRoutingModule } from './show-shifts-routing.module';

import { ShowShiftsPage } from './show-shifts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowShiftsPageRoutingModule
  ],
  declarations: [ShowShiftsPage]
})
export class ShowShiftsPageModule {}
