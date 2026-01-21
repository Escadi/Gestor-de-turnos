import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkerSchedulePageRoutingModule } from './worker-schedule-routing.module';
import { WorkerSchedulePage } from './worker-schedule.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkerSchedulePageRoutingModule
    ],
    declarations: [WorkerSchedulePage]
})
export class WorkerSchedulePageModule { }
