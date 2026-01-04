import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkerVacationsPageRoutingModule } from './worker-vacations-routing.module';
import { WorkerVacationsPage } from './worker-vacations.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkerVacationsPageRoutingModule,
        WorkerVacationsPage
    ],
    declarations: []
})
export class WorkerVacationsPageModule { }
