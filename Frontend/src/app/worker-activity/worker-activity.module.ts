import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkerActivityPageRoutingModule } from './worker-activity-routing.module';

import { WorkerActivityPage } from './worker-activity.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkerActivityPageRoutingModule
    ],
    declarations: [WorkerActivityPage]
})
export class WorkerActivityPageModule { }
