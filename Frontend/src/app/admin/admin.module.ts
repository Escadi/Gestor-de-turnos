import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
// CDK Module for Drag & Drop functionality (requires aligned versions)

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomePage } from './admin-home/admin-home.page';
import { ManageWorkersPage } from './manage-workers/manage-workers.page';
import { ManageCategoriesPage } from './manage-categories/manage-categories.page';
import { ManageDepartamentPage } from './manage-departament/manage-departament.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AdminRoutingModule,
        DragDropModule,
        ScrollingModule
    ],
    declarations: [
        AdminHomePage,
        ManageWorkersPage,
        ManageCategoriesPage,
        ManageDepartamentPage
    ]
})
export class AdminModule { }
