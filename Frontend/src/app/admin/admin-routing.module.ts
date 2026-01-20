import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHomePage } from './admin-home/admin-home.page';
import { ManageWorkersPage } from './manage-workers/manage-workers.page';
import { ManageCategoriesPage } from './manage-categories/manage-categories.page';

const routes: Routes = [
    {
        path: '',
        component: AdminHomePage
    },
    {
        path: 'workers',
        component: ManageWorkersPage
    },
    {
        path: 'categories',
        component: ManageCategoriesPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }
