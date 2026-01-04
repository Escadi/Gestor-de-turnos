import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserWorkerPageRoutingModule } from './user-worker-routing.module';
import { UserWorkerPage } from './user-worker.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserWorkerPageRoutingModule,
        UserWorkerPage
    ],
    declarations: []
})
export class UserWorkerPageModule { }
