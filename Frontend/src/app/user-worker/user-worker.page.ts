import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyServices } from '../services/my-services';

@Component({
    selector: 'app-user-worker',
    templateUrl: './user-worker.page.html',
    styleUrls: ['./user-worker.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class UserWorkerPage implements OnInit {


    constructor(private myServices: MyServices) { }

    ngOnInit() {

    }

    logout() {
        this.myServices.logout();
    }



}
