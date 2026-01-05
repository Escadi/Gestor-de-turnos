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

    // Listado de fichajes
    history: any[] = [];

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

        // Cargar historial
        this.loadHistory();

        // TODO: Cargar estado real del servidor si ya fichó hoy
        this.isClockedIn = false;
    }

    loadHistory() {
        // ID 1 hardcoded por ahora
        this.myServices.getShifts(1).subscribe({
            next: (res: any) => {
                this.history = res;
                console.log("Historial cargado:", this.history);
                this.calculateDailySummary();
            },
            error: (err) => {
                console.error("Error cargando historial:", err);
            }
        });
    }

    calculateDailySummary() {
        if (!this.history || this.history.length === 0) return;

        const today = new Date().toDateString();
        const todaysShifts = this.history.filter((shift: any) => {
            const shiftDate = new Date(shift.date);
            return shiftDate.toDateString() === today;
        });

        // Ordenar por fecha ascendente para encontrar primero y último
        todaysShifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (todaysShifts.length > 0) {
            // Primer fichaje = Entrada
            const firstShift = todaysShifts[0];
            this.entryTime = new Date(firstShift.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            this.isClockedIn = true; // Asumimos que si hay fichaje hoy, empezó jornada. 
            // Nota: Podría ser más complejo si ya fichó salida.

            // Si hay más de 1 fichaje, el último es la salida (o el último estado)
            if (todaysShifts.length > 1) {
                const lastShift = todaysShifts[todaysShifts.length - 1];
                this.exitTime = new Date(lastShift.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                // Calculo simple de horas (Entrada vs Salida)
                const start = new Date(firstShift.date).getTime();
                const end = new Date(lastShift.date).getTime();
                const diffHours = (end - start) / (1000 * 60 * 60);
                this.hoursWorked = diffHours.toFixed(2);

                // Si el último fichaje es reciente y tenemos par, quizás estamos "Salidos"
                // Pero esto depende de la lógica de negocio (pares entrada/salida vs fichajes unicos).
                // Por ahora, si hay salida, isClockedIn = false
                this.isClockedIn = false;
            } else {
                // Solo un fichaje = Entrada activa
                this.exitTime = '';
                this.isClockedIn = true;

                // Calcular horas hasta AHORA
                const start = new Date(firstShift.date).getTime();
                const now = new Date().getTime();
                const diffHours = (now - start) / (1000 * 60 * 60);
                this.hoursWorked = diffHours.toFixed(2);
            }
        } else {
            this.entryTime = '';
            this.exitTime = '';
            this.hoursWorked = '0.0';
            this.isClockedIn = false;
        }
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
                this.loadHistory(); // Recargar lista
            },
            error: (err) => {
                console.error("Error al fichar:", err);
                alert("Error al conectar con el servidor.");
            }
        });
    }

    clockOut() {
        // Lógica similar podría aplicarse para salida, guardando otro registro
        // Nota: El backend createShift guarda un fichaje genérico. 
        // Deberíamos quizás marcar si es entrada o salida, pero por ahora solo guardamos fichajes.
        this.isClockedIn = false;
        const now = new Date();
        this.exitTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        this.lastAction = {
            type: 'Salida',
            datetime: now.toLocaleString('es-ES')
        };
        // Opcional: Guardar también la salida en BD si se desea
        // this.createShift(...) 
    }

}
