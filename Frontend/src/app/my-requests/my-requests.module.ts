import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyRequestsPageRoutingModule } from './my-requests-routing.module';
import { MyRequestsPage } from './my-requests.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyRequestsPageRoutingModule
    ],
    declarations: [MyRequestsPage]
})
export class MyRequestsPageModule { }
