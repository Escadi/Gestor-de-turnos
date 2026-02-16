import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, addMonths, eachDayOfInterval, isSameMonth, isSameDay, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    shift?: any;
}

@Component({
    selector: 'app-worker-activity',
    templateUrl: './worker-activity.page.html',
    styleUrls: ['./worker-activity.page.scss'],
    standalone: false
})
/**
 * ------------------------------------------------------------------------------------------
 * CONTROLADOR: WorkerActivityPage
 * ------------------------------------------------------------------------------------------
 * Gestiona la vista de actividad detallada de un empleado.
 * Muestra el calendario de turnos, fichajes realizados y permite descargar informes.
 * 
 * Funcionalidades principales:
 * 1. Visualización de turnos en calendario mensual.
 * 2. Listado cronológico de fichajes (Entradas/Salidas).
 * 3. Generación de reportes PDF de actividad.
 * ------------------------------------------------------------------------------------------
 */
export class WorkerActivityPage implements OnInit {

    worker: any = null;
    segment: string = 'horario';
    signings: any[] = [];
    groupedSignings: { date: string, entries: any[] }[] = [];

    // Calendar properties
    currentDate: Date = new Date();
    calendar: CalendarDay[][] = [];
    weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    shiftsMap: Map<string, any> = new Map();

    lastLocation: { lat: number, lng: number } | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private myServices: MyServices,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
    }

    /**
     * ------------------------------------------------------------------------------------------
     * GESTIÓN DE ENTRADA A LA VISTA (LIFECYCLE)
     * ------------------------------------------------------------------------------------------
     * Se ejecuta cada vez que el usuario entra a la página.
     * Prioriza la carga por ID desde la URL (queryParams) para evitar datos estancados.
     * Limpia el estado anterior antes de cargar nuevos datos.
     */

    ionViewWillEnter() {
        const state = this.router.getCurrentNavigation()?.extras.state || history.state;
        const queryParams = this.route.snapshot.queryParams;
        const workerIdFromParams = queryParams['id'] ? Number(queryParams['id']) : null;

        console.log('--- ionViewWillEnter ---');
        console.log('Params ID:', workerIdFromParams);
        console.log('State Worker ID:', state?.worker?.id);

        // Limpiar estado visual inmediatamente para evitar ver datos anteriores
        this.worker = null;
        this.signings = [];
        this.shiftsMap.clear();
        this.calendar = [];

        // 1. Prioridad: ID de la URL
        if (workerIdFromParams) {
            console.log('Loading worker from Params ID:', workerIdFromParams);
            this.loadWorkerById(workerIdFromParams);
        }
        // 2. Fallback: Estado del router (solo si no hay param ID, aunque idealmente siempre debería haber)
        else if (state && state.worker) {
            console.log('Loading worker from state:', state.worker.id);
            this.worker = state.worker;
            this.resetAndLoad();
        }
        // 3. Si no hay nada, volver
        else {
            console.warn('No worker found in state or params. Redirecting...');
            this.router.navigate(['/tab-user/my-workers']);
        }
    }

    loadWorkerById(id: number) {
        this.myServices.getWorker(id).subscribe({
            next: (res: any) => {
                this.worker = res;
                this.resetAndLoad();
            },
            error: (err) => {
                console.error('Error fetching worker', err);
                this.router.navigate(['/tab-user/my-workers']);
            }
        });
    }

    resetAndLoad() {
        this.signings = [];
        this.groupedSignings = [];
        this.shiftsMap.clear();
        this.lastLocation = null;
        this.currentDate = new Date();

        this.loadSignings();
        this.loadShifts();
    }

    ionViewDidEnter() {
    }

    segmentChanged(ev: any) {
        this.segment = ev.detail.value;
    }

    /**
     * ------------------------------------------------------------------------------------------
     * NAVEGACIÓN Y GENERACIÓN DEL CALENDARIO
     * ------------------------------------------------------------------------------------------
     */

    // Retroceder un mes en el calendario
    prevMonth() {
        this.currentDate = subMonths(this.currentDate, 1);
        this.generateCalendar();
    }

    // Avanzar un mes en el calendario
    nextMonth() {
        this.currentDate = addMonths(this.currentDate, 1);
        this.generateCalendar();
    }

    // Formatea el mes actual para mostrar en la cabecera (Ej: "Febrero 2026")
    get callbackCurrentMonthFormatted(): string {
        const dateStr = format(this.currentDate, 'MMMM yyyy', { locale: es });
        return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    /**
     * Genera la matriz de días para el calendario visual.
     * Calcula días de relleno del mes anterior/siguiente para completar semanas.
     */
    generateCalendar() {
        const start = startOfWeek(startOfMonth(this.currentDate), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(this.currentDate), { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start, end });
        const weeks: CalendarDay[][] = [];
        let currentWeek: CalendarDay[] = [];

        days.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');

            currentWeek.push({
                date: day,
                isCurrentMonth: isSameMonth(day, this.currentDate),
                isToday: isSameDay(day, new Date()),
                shift: this.shiftsMap.get(dateKey)
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        this.calendar = weeks;
    }

    getShiftColorStyle(shift: any): string {
        if (!shift || !shift.color) return 'var(--ion-color-medium)';
        if (shift.color === 'medium') return 'var(--ion-color-medium)';
        return `var(--ion-color-${shift.color})`;
    }

    /**
     * ------------------------------------------------------------------------------------------
     * CARGA DE DATOS (FICHAJES Y TURNOS)
     * ------------------------------------------------------------------------------------------
     */

    // Carga el historial de fichajes del trabajador actual
    async loadSignings() {
        const loading = await this.loadingCtrl.create({
            message: 'Cargando actividad...',
            duration: 5000
        });
        await loading.present();

        this.myServices.getSignings(this.worker.id).subscribe({
            next: (res: any) => {
                this.signings = res || [];
                this.signings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                this.processGroupedSignings();

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

    /**
     * Agrupa los fichajes por día para mostrarlos ordenados en la lista.
     * También intenta resolver la dirección física (geocoding) si hay coordenadas.
     */
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

        for (const group of this.groupedSignings) {
            for (const s of group.entries) {
                if (s.lat && s.lng && !s.address) {
                    this.myServices.getAddressFromCoords(s.lat, s.lng).subscribe({
                        next: (res: any) => {
                            if (res && res.display_name) {
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
        return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=16&l=map&size=450,300&pt=${lng},${lat},pm2rdm`;
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
     * Carga los turnos del trabajador.
     * Implementa una estrategia robusta con múltiples intentos (fallbacks):
     * 1. Carga tipos de turno.
     * 2. Intenta cargar turnos filtrados por backend.
     * 3. Si falla, intenta cargar todos y filtrar manualmente.
     * 4. Último recurso: endpoint específico de relaciones (workerShifts).
     */
    loadShifts() {
        if (!this.worker) return;
        const workerId = this.worker.id;
        console.log('Loading shifts for worker:', workerId);

        // Estrategia de carga:
        // 1. Obtener catálogo de tipos de turno (TimeShifts)
        // 2. Obtener turnos asignados (getShifts)
        // 3. Fallback: Filtrado manual o endpoint alternativo

        this.myServices.getTimeShifts().subscribe({
            next: (timeShifts: any) => {
                this.myServices.getShifts(workerId).subscribe({
                    next: (response: any) => {
                        console.log('getShifts(workerId) response:', response);
                        let rawShifts: any[] = [];
                        if (Array.isArray(response)) rawShifts = response;
                        else if (response && Array.isArray(response.data)) rawShifts = response.data;
                        else if (response && Array.isArray(response.shifts)) rawShifts = response.shifts;

                        if (rawShifts.length > 0) {
                            this.processFetchedShifts(rawShifts, timeShifts || []);
                        } else {
                            console.warn('getShifts(workerId) returned empty. Trying manual filter of ALL shifts...');
                            this.loadAllShiftsAndFilter(workerId, timeShifts);
                        }
                    },
                    error: (err) => {
                        console.error('Error in getShifts(workerId):', err);
                        this.loadAllShiftsAndFilter(workerId, timeShifts);
                    }
                });
            },
            error: (err) => {
                console.error('Error loading time shifts:', err);
                // Intentar cargar sin tipos (mostrará solo horas/info básica si está disponible)
                this.loadAllShiftsAndFilter(workerId, []);
            }
        });
    }

    private loadAllShiftsAndFilter(workerId: number, timeShifts: any[]) {
        this.myServices.getShifts().subscribe({
            next: (allShifts: any) => {
                const shifts = Array.isArray(allShifts) ? allShifts : [];
                console.log('Filtering from ALL shifts (' + shifts.length + ')');

                // Filtrar manualmente como hace shifts.page.ts
                const workerShifts = shifts.filter((shift: any) => {
                    if (shift.workerShifts && Array.isArray(shift.workerShifts)) {
                        return shift.workerShifts.some((ws: any) => ws.idWorker === workerId);
                    }
                    return shift.workerId === workerId || shift.idWorker === workerId;
                });

                console.log('Found ' + workerShifts.length + ' shifts for worker ' + workerId);
                this.processFetchedShifts(workerShifts, timeShifts || []);
            },
            error: (e) => {
                console.error('Error loading ALL shifts:', e);
                // Último intento: getWorkerShifts
                this.myServices.getWorkerShifts(workerId).subscribe({
                    next: (res: any) => {
                        const s = Array.isArray(res) ? res : (res.shifts || res.data || []);
                        this.processFetchedShifts(s, timeShifts || []);
                    },
                    error: (err2) => console.error('All methods failed', err2)
                });
            }
        });
    }

    /**
     * Procesa los turnos crudos obtenidos de la API y los mapea al calendario.
     * Normaliza fechas y asigna colores/tipos según el ID del turno.
     */
    private processFetchedShifts(rawShifts: any[], timeShifts: any[]) {
        console.log('--- PROCESSING SHIFTS ---', rawShifts);
        this.shiftsMap.clear();

        rawShifts.forEach((shift: any) => {
            // Robustez: buscar la fecha en varios niveles
            let rawDate = shift.date || shift.entryDate || shift.Shift?.date;

            if (!rawDate) return;

            let dateKey = '';
            // Extraer YYYY-MM-DD independientemente del formato
            if (typeof rawDate === 'string') {
                dateKey = rawDate.split('T')[0].split(' ')[0]; // "2026-02-16"
            } else if (rawDate instanceof Date) {
                dateKey = format(rawDate, 'yyyy-MM-dd');
            } else {
                const d = new Date(rawDate);
                if (!isNaN(d.getTime())) {
                    dateKey = format(d, 'yyyy-MM-dd');
                }
            }

            if (!dateKey || dateKey.length < 10) return;

            let hours = 'Turno desconocido';
            let type = '';
            let color = 'medium';

            // Extracción de ID robusta (soporta diferentes convenciones de nombres de la API)
            const idVal = shift.idTimeShift ?? shift.id_time_shift ?? shift.id_turno ?? shift.idTime_shift ?? shift.Shift?.idTimeShift;
            const id = idVal !== null && idVal !== undefined ? Number(idVal) : -1;

            if (id === 0) {
                hours = '-';
                type = 'Sin asignar';
                color = 'light';
            } else if (id === 8) {
                hours = 'Libre';
                type = ''; // Text removed to avoid redundancy
                color = 'success';
            } else if (id === 9) {
                hours = 'Vacaciones';
                type = ''; // Text removed to avoid redundancy
                color = 'tertiary';
            } else if (id !== -1) {
                const timeShift = timeShifts.find((ts: any) => ts.id == id || ts.id_time_shift == id);
                if (timeShift) {
                    hours = timeShift.hours;
                    type = timeShift.name || timeShift.nameCategory;
                    color = 'primary';
                }
            }

            this.shiftsMap.set(dateKey, {
                ...shift,
                normalizedId: id, // Store the resolved ID for the template
                hoursDisplay: hours,
                typeDisplay: type,
                color: color
            });
        });

        console.log('Shifts Map Size:', this.shiftsMap.size);
        this.generateCalendar();
    }

    /**
      * ------------------------------------------------------------------------------------------
      * GENERACIÓN DE REPORTES (PDF)
      * ------------------------------------------------------------------------------------------
      */
    async generatePdf() {
        const loading = await this.loadingCtrl.create({
            message: 'Generando PDF...',
            spinner: 'crescent'
        });
        await loading.present();

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

        const fichajesPorDia: { [key: string]: any[] } = {};

        this.signings.forEach((s: any) => {
            const fecha = s.date.split('T')[0];
            if (!fichajesPorDia[fecha]) {
                fichajesPorDia[fecha] = [];
            }
            fichajesPorDia[fecha].push(s);
        });

        const fichajes = Object.keys(fichajesPorDia).map(fecha => {
            const registros = fichajesPorDia[fecha].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            const entrada = registros[0];
            const salida = registros[registros.length - 1];

            const [year, month, day] = fecha.split('-');
            const fechaFormateada = `${day}-${month}-${year}`;

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
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `fichajes_${this.worker.name}_${new Date().toISOString().split('T')[0]}.pdf`;
                link.click();
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
