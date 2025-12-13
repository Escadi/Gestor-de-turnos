import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkersDetailsCrudPageRoutingModule } from './workers-details-crud-routing.module';

import { WorkersDetailsCrudPage } from './workers-details-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkersDetailsCrudPageRoutingModule
  ],
  declarations: [WorkersDetailsCrudPage]
})
export class WorkersDetailsCrudPageModule {}
