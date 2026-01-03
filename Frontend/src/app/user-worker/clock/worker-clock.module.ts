import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkerClockPageRoutingModule } from './worker-clock-routing.module';
import { WorkerClockPage } from './worker-clock.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkerClockPageRoutingModule
    ],
    declarations: [WorkerClockPage]
})
export class WorkerClockPageModule { }
