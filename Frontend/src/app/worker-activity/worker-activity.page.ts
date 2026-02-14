import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

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

    lastLocation: { lat: number, lng: number } | null = null;
    constructor(
        private router: Router,
        private myServices: MyServices,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
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
        this.loadSignings();
        this.loadShifts();
    }

    ionViewDidEnter() {
    }

    segmentChanged(ev: any) {
        this.segment = ev.detail.value;
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
                }
                loading.dismiss();
            },
            error: (err) => {
                console.error(err);
                loading.dismiss();
            }
        });
    }

    async processGroupedSignings() {
        const groups: { [key: string]: any[] } = {};

        this.signings.forEach(s => {
            const d = new Date(s.date);
            const dateKey = d.toISOString().split('T')[0];
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(s);
        });

        this.groupedSignings = Object.keys(groups)
            .sort((a, b) => b.localeCompare(a))
            .map(date => {
                const entries = groups[date].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                return {
                    date: date,
                    entries: entries
                };
            });

        // Fetch addresses for each signing asynchronously
        for (const group of this.groupedSignings) {
            for (const s of group.entries) {
                if (s.lat && s.lng && !s.address) {
                    this.myServices.getAddressFromCoords(s.lat, s.lng).subscribe({
                        next: (res: any) => {
                            if (res && res.display_name) {
                                // Extract relevant parts of the address for "datos, lugar"
                                s.locationName = res.display_name;
                            }
                        },
                        error: (err) => console.error('Error fetching address', err)
                    });
                }
            }
        }
    }

    getStaticMapUrl(lat: any, lng: any) {
        if (!lat || !lng) return 'assets/no-location.png';
        // Yandex Static Map API - Higher resolution and zoom for better detail
        return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=16&l=map&size=450,300&pt=${lng},${lat},pm2rdm`;
    }
    /**
     * --------------------------------------------------------------
     * CARGA DE LOS TURNOS DEL TRABAJADOR.
     * --------------------------------------------------------------
     */
    loadShifts() {
        if (!this.worker) return;

        const workerId = this.worker.id;

        // Primero cargar los tipos de turnos (timeShifts)
        this.myServices.getTimeShifts().subscribe({
            next: (timeShifts: any) => {
                // Luego cargar los turnos específicos del trabajador
                this.myServices.getWorkerShifts(workerId).subscribe({
                    next: (workerShifts: any) => {
                        const rawShifts = workerShifts || [];

                        if (rawShifts.length === 0) {
                            console.log('No shifts found for worker:', workerId);
                        }

                        this.processFetchedShifts(rawShifts, timeShifts || []);
                    },
                    error: (err) => {
                        console.error('Error loading worker shifts:', err);
                        // Intentar con el endpoint general como fallback
                        this.myServices.getShifts(workerId).subscribe({
                            next: (genShifts: any) => {
                                this.processFetchedShifts(genShifts || [], timeShifts || []);
                            },
                            error: (e) => {
                                console.error('Error loading shifts fallback:', e);
                                this.processFetchedShifts([], timeShifts || []);
                            }
                        });
                    }
                });
            },
            error: (err) => {
                console.error('Error loading time shifts:', err);
                // Intentar cargar los turnos del trabajador sin los tipos de turno
                this.myServices.getWorkerShifts(workerId).subscribe({
                    next: (workerShifts: any) => {
                        this.processFetchedShifts(workerShifts || [], []);
                    },
                    error: (e) => {
                        console.error('Error loading worker shifts without time shifts:', e);
                    }
                });
            }
        });
    }

    private processFetchedShifts(rawShifts: any[], timeShifts: any[]) {
        console.log('Processing raw shifts:', rawShifts);

        const processedShifts = rawShifts.map((shift: any) => {
            let hours = 'Turno desconocido';
            let type = '';

            // Intentar detectar la ID del turno desde varias propiedades posibles
            const idVal = shift.idTimeShift ?? shift.id_time_shift ?? shift.id_turno ?? shift.idTime_shift;
            const id = idVal !== null && idVal !== undefined ? Number(idVal) : -1;

            if (id === 0) {
                hours = '-';
                type = 'Sin asignar';
            } else if (id === 8) {
                hours = 'Libre';
                type = 'Día de descanso';
            } else if (id === 9) {
                hours = 'Vacaciones ✈️';
                type = 'Vacaciones';
            } else if (id !== -1) {
                // Buscamos en los turnos de horario cargados
                const timeShift = timeShifts.find((ts: any) => ts.id == id || ts.id_time_shift == id);
                if (timeShift) {
                    hours = timeShift.hours;
                    type = timeShift.name || timeShift.nameCategory;
                }
            }

            return {
                ...shift,
                hours: hours,
                type: type
            };
        });

        this.shifts = processedShifts;
        this.groupShiftsByWeek(processedShifts);
    }

    groupedShifts: any[] = [];

    groupShiftsByWeek(shifts: any[]) {
        console.log('Grouping shifts:', shifts);
        const groups: { [key: string]: any[] } = {};

        shifts.forEach(shift => {
            if (!shift.date) {
                console.warn('Shift missing date:', shift);
                return;
            }

            const date = this.parseDate(shift.date);
            if (!date || isNaN(date.getTime())) {
                console.warn('Invalid date for shift:', shift);
                return;
            }

            const weekStart = this.getMonday(date);
            const weekKey = weekStart.toISOString().split('T')[0]; // Lunes de la semana

            if (!groups[weekKey]) {
                groups[weekKey] = [];
            }
            groups[weekKey].push(shift);
        });

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        // Convertir a array y ordenar (Semanas más recientes primero)
        this.groupedShifts = Object.keys(groups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(weekStart => {
                const weekStartDate = new Date(weekStart);
                const weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekStartDate.getDate() + 6);

                return {
                    weekStart: weekStart,
                    weekLabel: `Semana del ${weekStartDate.getDate()} ${monthNames[weekStartDate.getMonth()]} al ${weekEndDate.getDate()} ${monthNames[weekEndDate.getMonth()]}`,
                    shifts: groups[weekStart].sort((a: any, b: any) => this.parseDate(a.date).getTime() - this.parseDate(b.date).getTime()),
                    expanded: false
                };
            });

        console.log('Grouped Shifts Result:', this.groupedShifts);

        // Expandir la primera semana (la actual/futura más cercana)
        if (this.groupedShifts.length > 0) {
            this.groupedShifts[0].expanded = true;
        }
    }

    parseDate(dateStr: any): Date {
        if (!dateStr) return new Date('Invalid');
        if (dateStr instanceof Date) return dateStr;

        // Try standard parsing
        let d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d;

        // Try YYYY-MM-DD
        if (typeof dateStr === 'string') {
            // Handle DD-MM-YYYY or DD/MM/YYYY
            const parts = dateStr.replace(/\//g, '-').split('-');
            if (parts.length === 3) {
                // Check if first part looks like year (4 digits)
                if (parts[0].length === 4) {
                    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                }
                // Assume DD-MM-YYYY
                return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
            }
        }

        return new Date('Invalid');
    }

    getMonday(d: Date) {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    toggleWeek(group: any) {
        group.expanded = !group.expanded;
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

    /**
     * --------------------------------------------------------------
     * Genera un PDF con los turnos del trabajador.
     * --------------------------------------------------------------
     */
    async generatePdf() {
        const loading = await this.loadingCtrl.create({
            message: 'Generando PDF...',
            spinner: 'crescent'
        });
        await loading.present();

        // Validar que hay datos
        if (!this.signings || this.signings.length === 0) {
            await loading.dismiss();
            const alert = await this.alertCtrl.create({
                header: 'Sin datos',
                message: 'No hay fichajes para generar el PDF',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }


        // Agrupar fichajes por fecha
        const fichajesPorDia: { [key: string]: any[] } = {};

        this.signings.forEach((s: any) => {
            const fecha = s.date.split('T')[0]; // Obtener solo la fecha (YYYY-MM-DD)
            if (!fichajesPorDia[fecha]) {
                fichajesPorDia[fecha] = [];
            }
            fichajesPorDia[fecha].push(s);
        });

        // Mapear los datos al formato que espera el backend
        const fichajes = Object.keys(fichajesPorDia).map(fecha => {
            const registros = fichajesPorDia[fecha].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            const entrada = registros[0]; // Primer registro del día
            const salida = registros[registros.length - 1]; // Último registro del día

            // Formatear fecha de forma segura (DD-MM-YYYY)
            const [year, month, day] = fecha.split('-');
            const fechaFormateada = `${day}-${month}-${year}`;

            // Formatear hora de forma segura (HH:MM:SS)
            const formatTime = (dateStr: string) => {
                const d = new Date(dateStr);
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                const seconds = String(d.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            };

            return {
                numeroEmpleado: this.worker.id,
                empleado: `${this.worker.name} ${this.worker.surname}`,
                fecha: fechaFormateada,
                horaEntrada: formatTime(entrada.date),
                horaSalida: registros.length > 1
                    ? formatTime(salida.date)
                    : 'Sin salida'
            };
        });

        const pdfData = { fichajes };

        console.log('Datos enviados al backend para PDF:', pdfData);

        this.myServices.generatePdf(pdfData).subscribe({
            next: (blob: Blob) => {
                loading.dismiss();

                // Crear un enlace temporal para descargar el archivo
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `fichajes_${this.worker.name}_${new Date().toISOString().split('T')[0]}.pdf`;
                link.click();

                // Limpiar el objeto URL
                window.URL.revokeObjectURL(url);

                this.alertCtrl.create({
                    header: 'Éxito',
                    message: 'PDF generado correctamente',
                    buttons: ['OK']
                }).then(alert => alert.present());
            },
            error: (err) => {
                console.error('Error generando PDF:', err);
                loading.dismiss();
                this.alertCtrl.create({
                    header: 'Error',
                    message: 'No se pudo generar el PDF. Intenta nuevamente.',
                    buttons: ['OK']
                }).then(alert => alert.present());
            }
        });
    }

}
