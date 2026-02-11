import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowRequestAllPageRoutingModule } from './show-request-all-routing.module';

import { ShowRequestAllPage } from './show-request-all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowRequestAllPageRoutingModule
  ],
  declarations: [ShowRequestAllPage]
})
export class ShowRequestAllPageModule {}
