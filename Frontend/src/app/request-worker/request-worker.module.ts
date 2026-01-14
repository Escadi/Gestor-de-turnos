import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestWorkerPageRoutingModule } from './request-worker-routing.module';

import { RequestWorkerPage } from './request-worker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestWorkerPageRoutingModule
  ],
  declarations: [RequestWorkerPage]
})
export class RequestWorkerPageModule {}
