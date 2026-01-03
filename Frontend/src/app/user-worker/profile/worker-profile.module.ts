import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WorkerProfilePageRoutingModule } from './worker-profile-routing.module';
import { WorkerProfilePage } from './worker-profile.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkerProfilePageRoutingModule
    ],
    declarations: [WorkerProfilePage]
})
export class WorkerProfilePageModule { }
