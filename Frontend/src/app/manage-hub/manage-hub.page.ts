import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';

@Component({
    selector: 'app-manage-hub',
    templateUrl: './manage-hub.page.html',
    styleUrls: ['./manage-hub.page.scss'],
    standalone: false
})
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

    goTo(path: string) {
        this.router.navigateByUrl(path);
    }

    goWorkers() { this.goTo('/my-workers'); }
    goShifts() { this.goTo('/shifts'); }
    goRequests() { this.goTo('/tab-user/requests'); } // Or a specific manager view if needed
    goAbences() { this.goTo('/tab-user/abences'); } // Or a specific manager view if needed
}
