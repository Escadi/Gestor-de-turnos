import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-worker-profile',
    templateUrl: './worker-profile.page.html',
    styleUrls: ['./worker-profile.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class WorkerProfilePage implements OnInit {

    // Datos de ejemplo del trabajador
    workerId: string = '001';
    workerName: string = 'Juan';
    workerSurname: string = 'Pérez García';
    workerFunction: string = 'Camarero';
    workerEmail: string = 'juan.perez@example.com';
    workerPhone: string = '+34 600 123 456';
    workerStartDate: string = '15/03/2024';
    workerWeeklyHours: number = 40;
    workerStatus: string = 'Activo';

    constructor() { }

    ngOnInit() {
        // TODO: Cargar datos del trabajador desde el servicio
    }

}
