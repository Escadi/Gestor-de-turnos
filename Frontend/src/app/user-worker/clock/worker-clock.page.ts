import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyServices } from '../../services/my-services';

@Component({
    selector: 'app-worker-clock',
    templateUrl: './worker-clock.page.html',
    styleUrls: ['./worker-clock.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
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

    constructor(private myServices: MyServices) { }

    ngOnInit() {
        this.updateTime();
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);

        // Iniciar mapa
        setTimeout(() => {
            this.initMap();
        }, 500);

        // TODO: Cargar estado real del servidor si ya fichó hoy
        this.isClockedIn = false;
    }

    // Leaflet map
    map: any;
    currentLat: number = 0;
    currentLng: number = 0;

    initMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;

                // @ts-ignore
                const L = window['L'];
                if (L) {
                    this.map = L.map('map').setView([this.currentLat, this.currentLng], 15);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(this.map);

                    L.marker([this.currentLat, this.currentLng]).addTo(this.map)
                        .bindPopup('Tu ubicación actual')
                        .openPopup();
                }

            }, (error) => {
                console.error("Error obteniendo ubicación", error);
            });
        }
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
        if (!this.currentLat || !this.currentLng) {
            alert("Esperando ubicación...");
            return;
        }

        const shiftData = {
            idWorker: 1, // TODO: Usar ID real del usuario logueado
            idTimes: 1, // Por defecto o lógica de turno
            lat: this.currentLat,
            lng: this.currentLng,
            date: new Date()
        };

        this.myServices.createShift(shiftData).subscribe({
            next: (res) => {
                console.log("Fichaje realizado:", res);
                this.isClockedIn = true;
                const now = new Date();
                this.entryTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                this.lastAction = {
                    type: 'Entrada',
                    datetime: now.toLocaleString('es-ES')
                };
                alert(`Entrada fichada en: ${this.currentLat}, ${this.currentLng}`);
            },
            error: (err) => {
                console.error("Error al fichar:", err);
                alert("Error al conectar con el servidor.");
            }
        });
    }

    clockOut() {
        // Lógica similar podría aplicarse para salida, guardando otro registro
        this.isClockedIn = false;
        const now = new Date();
        this.exitTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        this.lastAction = {
            type: 'Salida',
            datetime: now.toLocaleString('es-ES')
        };
    }

}
