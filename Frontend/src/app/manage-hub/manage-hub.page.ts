import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';

@Component({
    selector: 'app-manage-hub',
    templateUrl: './manage-hub.page.html',
    styleUrls: ['./manage-hub.page.scss'],
    standalone: false
})
/**
 * CONTROLADOR: ManageHubPage
 * Dashboard principal para gestores.
 * Centraliza la navegación a las herramientas de administración.
 */
export class ManageHubPage implements OnInit {

    currentUser: any = null;

    constructor(
        private router: Router,
        public myServices: MyServices
    ) { }

    ngOnInit() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
        }
    }

    logout() {
        this.myServices.logout();
    }

    /**
     * Navegación centralizada.
     * @param path Ruta destino
     */
    goTo(path: string) {
        this.router.navigateByUrl(path);
    }

    goWorkers() { this.goTo('/tab-user/my-workers'); }
    goShifts() { this.goTo('/tab-user/shifts'); }
    goRequests() { this.goTo('/tab-user/requests'); }
    goAbences() { this.goTo('/tab-user/abences'); }
    goRequestAbencesAll() { this.goTo('/tab-user/request-abences-all'); }
    goApprovals() { this.goTo('/tab-user/approvals'); }
}
