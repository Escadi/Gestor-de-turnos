import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestAbencesAllPageRoutingModule } from './request-abences-all-routing.module';

import { RequestAbencesAllPage } from './request-abences-all.page';
import { ComponentRequestAbencesComponent } from '../component-request-abences/component-request-abences.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestAbencesAllPageRoutingModule
  ],
  declarations: [
    RequestAbencesAllPage,
    ComponentRequestAbencesComponent
  ]
})
export class RequestAbencesAllPageModule { }
