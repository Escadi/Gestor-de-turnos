import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-worker-clock',
    templateUrl: './worker-clock.page.html',
    styleUrls: ['./worker-clock.page.scss'],
})
export class WorkerClockPage implements OnInit, OnDestroy {

    currentTime: string = '';
    currentDate: string = '';
    isClockedIn: boolean = false;

    lastAction: any = null;
    hoursWorked: string = '0.0';
    entryTime: string = '';
    exitTime: string = '';

    private timeInterval: any;

    constructor() { }

    ngOnInit() {
        this.updateTime();
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);

        // Datos de ejemplo
        this.lastAction = {
            type: 'Entrada',
            datetime: '03/01/2026 09:00'
        };
        this.entryTime = '09:00';
        this.hoursWorked = '2.5';
        this.isClockedIn = true;
    }

    ngOnDestroy() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    updateTime() {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.currentDate = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    clockIn() {
        // TODO: Implementar lógica de fichaje de entrada
        this.isClockedIn = true;
        const now = new Date();
        this.entryTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        this.lastAction = {
            type: 'Entrada',
            datetime: now.toLocaleString('es-ES')
        };
    }

    clockOut() {
        // TODO: Implementar lógica de fichaje de salida
        this.isClockedIn = false;
        const now = new Date();
        this.exitTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        this.lastAction = {
            type: 'Salida',
            datetime: now.toLocaleString('es-ES')
        };
    }

}
