import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-worker-activity',
    templateUrl: './worker-activity.page.html',
    styleUrls: ['./worker-activity.page.scss'],
    standalone: false
})
export class WorkerActivityPage implements OnInit {

    worker: any = null;
    segment: string = 'fichajes';
    signings: any[] = [];
    groupedSignings: { date: string, entries: any[] }[] = [];
    shifts: any[] = [];

    map: any;
    lastLocation: { lat: number, lng: number } | null = null;

    constructor(
        private router: Router,
        private myServices: MyServices,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        // We use ionViewWillEnter for data loading to handle stack re-use
    }

    ionViewWillEnter() {
        // Recover state from history or router
        const state = this.router.getCurrentNavigation()?.extras.state || history.state;
        if (state && state.worker) {
            this.worker = state.worker;
            this.resetAndLoad();
        } else if (!this.worker) {
            // Fallback if no worker in state (e.g. refresh)
            this.router.navigate(['/tab-user/my-workers']);
        }
    }

    resetAndLoad() {
        this.signings = [];
        this.groupedSignings = [];
        this.shifts = [];
        this.lastLocation = null;
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.loadSignings();
        this.loadShifts();
    }

    ionViewDidEnter() {
        if (this.segment === 'fichajes' && this.lastLocation) {
            this.initMap();
        }
    }

    segmentChanged(ev: any) {
        this.segment = ev.detail.value;
        if (this.segment === 'fichajes' && this.lastLocation) {
            setTimeout(() => {
                this.initMap();
            }, 100);
        }
    }

    async loadSignings() {
        const loading = await this.loadingCtrl.create({
            message: 'Cargando actividad...',
            duration: 5000 // Timeout safety
        });
        await loading.present();

        this.myServices.getSignings(this.worker.id).subscribe({
            next: (res: any) => {
                this.signings = res || [];
                // Sort descending for general list
                this.signings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                this.processGroupedSignings();

                // Find last valid location
                const lastWithLoc = this.signings.find(s => s.lat && s.lng);
                if (lastWithLoc) {
                    this.lastLocation = { lat: Number(lastWithLoc.lat), lng: Number(lastWithLoc.lng) };
                    if (this.segment === 'fichajes') {
                        setTimeout(() => this.initMap(), 500);
                    }
                }
                loading.dismiss();
            },
            error: (err) => {
                console.error(err);
                loading.dismiss();
            }
        });
    }

    processGroupedSignings() {
        const groups: { [key: string]: any[] } = {};

        this.signings.forEach(s => {
            const d = new Date(s.date);
            const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(s);
        });

        this.groupedSignings = Object.keys(groups)
            .sort((a, b) => b.localeCompare(a)) // Latest dates first
            .map(date => {
                const entries = groups[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                return {
                    date: date,
                    entries: entries
                };
            });
    }

    getStaticMapUrl(lat: any, lng: any) {
        if (!lat || !lng) return 'assets/no-location.png';
        // Yandex Static Map API - Usually works without API key for low-med volume
        return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=14&l=map&size=250,150&pt=${lng},${lat},pm2rdm`;
    }

    loadShifts() {
        this.myServices.getWorkerShifts(this.worker.id).subscribe({
            next: (res: any) => {
                this.shifts = res || [];
                this.shifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            },
            error: (err) => console.error('Error loading shifts', err)
        });
    }

    initMap() {
        if (!this.lastLocation) return;
        const L = (window as any)['L'];
        if (!L) return;

        const mapContainer = document.getElementById('mapActivity');
        if (!mapContainer) return;

        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        try {
            this.map = L.map('mapActivity').setView([this.lastLocation.lat, this.lastLocation.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OSM'
            }).addTo(this.map);

            L.marker([this.lastLocation.lat, this.lastLocation.lng])
                .addTo(this.map)
                .bindPopup(`Última conexión`)
                .openPopup();

            setTimeout(() => this.map.invalidateSize(), 300);
        } catch (e) {
            console.error("Error init map:", e);
        }
    }

    getSigningIcon(s: any, index: number, total: number) {
        if (total === 1) return 'radio-button-on-outline';
        if (index === 0) return 'enter-outline';
        if (index === total - 1) return 'exit-outline';
        return 'radio-button-on-outline';
    }

    getSigningColor(s: any, index: number, total: number) {
        if (total === 1) return 'primary';
        if (index === 0) return 'success';
        if (index === total - 1) return 'danger';
        return 'warning';
    }

}
