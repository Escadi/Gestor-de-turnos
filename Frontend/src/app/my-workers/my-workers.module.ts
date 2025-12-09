import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyWorkersPageRoutingModule } from './my-workers-routing.module';

import { MyWorkersPage } from './my-workers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyWorkersPageRoutingModule
  ],
  declarations: [MyWorkersPage]
})
export class MyWorkersPageModule {}
