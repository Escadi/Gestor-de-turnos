import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyServices } from '../../services/my-services';
import { Geolocation } from '@capacitor/geolocation';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-worker-clock',
    templateUrl: './worker-clock.page.html',
    styleUrls: ['./worker-clock.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class WorkerClockPage implements OnInit, OnDestroy {

    currentTime: string = '';
    currentDate: string = '';
    isClockedIn: boolean = false;

    lastAction: any = null;
    hoursWorked: string = '0.0';
    entryTime: string = '';
    exitTime: string = '';
    isAdmin: boolean = false;
    currentUser: any = null;

    private timeInterval: any;

    // Listado de fichajes
    history: any[] = [];

    constructor(
        private myServices: MyServices,
        private router: Router
    ) { }

    ngOnInit() {
        this.updateTime();
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);

        // Iniciar mapa
        setTimeout(() => {
            this.initMap();
        }, 500);

        // Cargar usuario de localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            this.isAdmin = this.currentUser.role === 'admin';
        }

        // Cargar historial
        this.loadHistory();

        this.isClockedIn = false;
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigateByUrl('/home');
    }

    loadHistory() {
        if (!this.currentUser) return;
        this.myServices.getSignings(this.currentUser.idWorker).subscribe({
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
        if (!this.history || this.history.length === 0) {
            this.entryTime = '';
            this.exitTime = '';
            this.hoursWorked = '0.0';
            this.isClockedIn = false;
            return;
        }

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

            // Lógica: Si hay número IMPAR de fichajes, está fichado (último fue entrada)
            // Si hay número PAR de fichajes, NO está fichado (último fue salida)
            const isCurrentlyWorking = todaysShifts.length % 2 === 1;
            this.isClockedIn = isCurrentlyWorking;

            if (todaysShifts.length > 1) {
                const lastShift = todaysShifts[todaysShifts.length - 1];

                if (isCurrentlyWorking) {
                    // Número impar: el último fichaje fue una entrada
                    // Calcular horas desde el último fichaje hasta ahora
                    this.exitTime = '';
                    const start = new Date(lastShift.date).getTime();
                    const now = new Date().getTime();
                    const diffHours = (now - start) / (1000 * 60 * 60);
                    this.hoursWorked = diffHours.toFixed(2);
                } else {
                    // Número par: el último fichaje fue una salida
                    this.exitTime = new Date(lastShift.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                    // Calcular total de horas trabajadas sumando todos los períodos
                    let totalHours = 0;
                    for (let i = 0; i < todaysShifts.length; i += 2) {
                        if (i + 1 < todaysShifts.length) {
                            const start = new Date(todaysShifts[i].date).getTime();
                            const end = new Date(todaysShifts[i + 1].date).getTime();
                            totalHours += (end - start) / (1000 * 60 * 60);
                        }
                    }
                    this.hoursWorked = totalHours.toFixed(2);
                }
            } else {
                // Solo un fichaje = Entrada activa
                this.exitTime = '';

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

    async initMap() {
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            this.currentLat = coordinates.coords.latitude;
            this.currentLng = coordinates.coords.longitude;

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

        } catch (error) {
            console.error("Error obteniendo ubicación", error);
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
            idWorker: this.currentUser ? this.currentUser.idWorker : 0,
            idTimes: 1, // Por defecto o lógica de turno
            lat: this.currentLat,
            lng: this.currentLng,
            date: new Date()
        };

        this.myServices.createSigning(shiftData).subscribe({
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
        if (!this.currentLat || !this.currentLng) {
            alert("Esperando ubicación...");
            return;
        }

        const shiftData = {
            idWorker: this.currentUser ? this.currentUser.idWorker : 0,
            idTimes: 1,
            lat: this.currentLat,
            lng: this.currentLng,
            date: new Date()
        };

        this.myServices.createSigning(shiftData).subscribe({
            next: (res) => {
                console.log("Salida fichada:", res);
                this.isClockedIn = false;
                const now = new Date();
                this.exitTime = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                this.lastAction = {
                    type: 'Salida',
                    datetime: now.toLocaleString('es-ES')
                };
                alert(`Salida fichada en: ${this.currentLat}, ${this.currentLng}`);
                this.loadHistory(); // Recargar lista
            },
            error: (err) => {
                console.error("Error al fichar salida:", err);
                alert("Error al conectar con el servidor.");
            }
        });
    }

}
