import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddWorkerPageRoutingModule } from './add-worker-routing.module';

import { AddWorkerPage } from './add-worker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddWorkerPageRoutingModule
  ],
  declarations: [AddWorkerPage]
})
export class AddWorkerPageModule {}
