import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbencesWorkerPageRoutingModule } from './abences-worker-routing.module';

import { AbencesWorkerPage } from './abences-worker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbencesWorkerPageRoutingModule
  ],
  declarations: [AbencesWorkerPage]
})
export class AbencesWorkerPageModule { }
