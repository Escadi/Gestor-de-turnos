import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SanctionsWorkerPageRoutingModule } from './sanctions-worker-routing.module';

import { SanctionsWorkerPage } from './sanctions-worker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SanctionsWorkerPageRoutingModule
  ],
  declarations: [SanctionsWorkerPage]
})
export class SanctionsWorkerPageModule {}
