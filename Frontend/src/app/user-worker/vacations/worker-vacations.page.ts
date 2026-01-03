import { Component, OnInit } from '@angular/core';

interface Vacation {
    title: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
    notes?: string;
}

@Component({
    selector: 'app-worker-vacations',
    templateUrl: './worker-vacations.page.html',
    styleUrls: ['./worker-vacations.page.scss'],
})
export class WorkerVacationsPage implements OnInit {

    totalDays: number = 22;
    usedDays: number = 10;
    remainingDays: number = 12;

    scheduledVacations: Vacation[] = [];

    constructor() { }

    ngOnInit() {
        this.loadVacations();
    }

    loadVacations() {
        // Datos de ejemplo
        this.scheduledVacations = [
            {
                title: 'Vacaciones de Verano',
                startDate: '15/07/2026',
                endDate: '31/07/2026',
                days: 15,
                status: 'Aprobado',
                notes: 'Vacaciones en familia'
            },
            {
                title: 'Navidad',
                startDate: '24/12/2026',
                endDate: '31/12/2026',
                days: 7,
                status: 'Pendiente',
                notes: 'Fin de año'
            }
        ];
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'aprobado':
                return 'success';
            case 'pendiente':
                return 'warning';
            case 'rechazado':
                return 'danger';
            default:
                return 'medium';
        }
    }

    requestVacation() {
        // TODO: Implementar formulario de solicitud de vacaciones
        console.log('Solicitar vacaciones');
    }

}
