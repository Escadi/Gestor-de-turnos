import { Component, OnInit } from '@angular/core';
import { MyServices } from 'src/app/services/my-services';


@Component({
    selector: 'app-worker-schedule',
    templateUrl: './worker-schedule.page.html',
    styleUrls: ['./worker-schedule.page.scss'],
    standalone: false
})
export class WorkerSchedulePage implements OnInit {
    weekNumber: number = 1;
    weekRange: string = '';
    weekSchedule: any[] = [];
    totalHours: number = 40;
    workDays: number = 5;
    restDays: number = 2;
    workers: any[] = [];
    workerIndex: number = 0;
    isLoading: boolean = false;

    constructor(
        private myServices: MyServices
    ) { }

    ngOnInit() {
        this.loadData();
    }
    onIonViewDidEnter() {
        this.loadCurrentWeek();
        this.loadWorkerShifts();
    }

    /**-----------------------------------------------------------------
    * VEMOS A TODOS LOS EMPLEADOS                      
    *  -----------------------------------------------------------------
    */

    getAllWorkers(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.myServices.getWorkers().subscribe({
                next: (data: any) => {
                    this.workers = data;
                    resolve();
                },
                error: (err) => {
                    console.error('Error cargando trabajadores:', err);
                    reject(err);
                }
            });
        });
    }

    /**
     *  -------------------------------------------------------------------------------------
     *  CARGA INICIAL DE DATOS CON PROGRESS BAR                          
     *  -------------------------------------------------------------------------------------
     */
    async loadData() {
        this.isLoading = true;
        try {
            // Primero cargar los trabajadores
            await this.getAllWorkers().catch(err => {
                console.error('Error al cargar trabajadores:', err);
                this.workers = []; // Asegurar que workers sea un array vacío si falla
            });

            // Cargar usuario de localStorage y buscar su índice
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const currentUser = JSON.parse(userStr);
                const loggedInWorkerId = currentUser.idWorker;
                console.log('Trabajador logueado:', loggedInWorkerId);

                // Buscar el índice del trabajador logueado
                const index = this.workers.findIndex(w => w.id === loggedInWorkerId);
                if (index !== -1) {
                    this.workerIndex = index;
                    console.log('Trabajador logueado encontrado:', this.workers[this.workerIndex]);
                }
            }

            await this.loadCurrentWeek();
        } catch (error) {
            console.error('Error general en loadData:', error);
        } finally {
            // Pequeño delay para que se vea el progress bar
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
        }
    }

    /** -----------------------------------------------------------------
     * CARGAR TURNOS PUBLICADOS DEL TRABAJADOR               
     *  -----------------------------------------------------------------
     */
    loadCurrentWeek() {
        this.weekNumber = this.getWeekNumber(new Date());
        this.weekRange = this.getWeekRange();
        this.loadWorkerShifts();
    }

    loadWorkerShifts() {
        if (this.workers.length === 0) {
            console.log('No hay trabajadores cargados');
            return;
        }

        const currentWorker = this.workers[this.workerIndex];
        if (!currentWorker) {
            console.log('No se encontró el trabajador actual');
            return;
        }

        console.log('Cargando turnos para trabajador:', currentWorker.id);

        // OBTENER TURNOS PUBLICADOS DEL TRABAJADOR
        this.myServices.getWorkerShifts(currentWorker.id).subscribe({
            next: (response: any) => {
                const shifts = Array.isArray(response) ? response : [];
                console.log('Turnos recibidos:', shifts);

                this.processShiftsForWeek(shifts);
            },
            error: (error: any) => {
                console.error('Error cargando turnos:', error);
                this.weekSchedule = this.generateEmptyWeek();
            }
        });
    }

    processShiftsForWeek(shifts: any[]) {
        const weekDays = this.generateWeekDays();
        const today = new Date().toISOString().substring(0, 10);

        let totalHours = 0;
        let workDays = 0;
        let restDays = 0;

        this.weekSchedule = weekDays.map(day => {
            // Buscar si hay un turno para esta fecha
            // La estructura es: WorkerShift -> shift -> timeShift
            const workerShift = shifts.find(ws => ws.shift && ws.shift.date === day.fechaLarga);

            if (workerShift && workerShift.shift && workerShift.shift.timeShift) {
                const shift = workerShift.shift;
                const timeShift = shift.timeShift;

                workDays++;
                // Calcular horas del turno (asumiendo formato "HH:MM - HH:MM")
                const hours = this.calculateShiftHours(timeShift.hours);
                totalHours += hours;

                return {
                    dayName: day.nombre,
                    date: day.numero + ' ' + this.getMonthName(new Date(day.fechaLarga)),
                    isToday: day.fechaLarga === today,
                    shift: {
                        hours: timeShift.hours,
                        type: timeShift.type || 'Turno',
                        color: this.getShiftColor(shift.idTimeShift)
                    }
                };
            } else {
                restDays++;
                return {
                    dayName: day.nombre,
                    date: day.numero + ' ' + this.getMonthName(new Date(day.fechaLarga)),
                    isToday: day.fechaLarga === today,
                    shift: null
                };
            }
        });

        this.totalHours = totalHours;
        this.workDays = workDays;
        this.restDays = restDays;
    }

    /** -----------------------------------------------------------------
     * GENERAMOS LOS DÍAS DE LA SEMANA
     *  -----------------------------------------------------------------
     */

    generateWeekDays() {
        const monday = this.getMonday(new Date());
        const days = [];
        const nombres = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            days.push({
                nombre: nombres[date.getDay()],
                numero: date.getDate(),
                fechaLarga: date.toISOString().substring(0, 10)
            });
        }

        return days;
    }

    /** -----------------------------------------------------------------
     * GENERAMOS UNA SEMANA VACÍA
     *  -----------------------------------------------------------------
     */

    generateEmptyWeek() {
        const weekDays = this.generateWeekDays();
        const today = new Date().toISOString().substring(0, 10);

        return weekDays.map(day => ({
            dayName: day.nombre,
            date: day.numero + ' ' + this.getMonthName(new Date(day.fechaLarga)),
            isToday: day.fechaLarga === today,
            shift: null
        }));
    }

    /** -----------------------------------------------------------------
     * OBTENEMOS EL LUNES DE LA SEMANA
     *  -----------------------------------------------------------------
     */

    getMonday(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    /** -----------------------------------------------------------------
     * CALCULAMOS LAS HORAS DEL TURNO
     *  -----------------------------------------------------------------
     */

    calculateShiftHours(hoursString: string): number {
        if (!hoursString || !hoursString.includes('-')) return 0;

        const [start, end] = hoursString.split('-').map(h => h.trim());
        const [startHour] = start.split(':').map(Number);
        const [endHour] = end.split(':').map(Number);

        return endHour - startHour;
    }

    /** -----------------------------------------------------------------
     * OBTENEMOS EL COLOR DEL TURNO SEGUN EL TURNO ASIGNADO
     *  -----------------------------------------------------------------
     */

    getShiftColor(idTimeShift: number): string {
        // Mapear IDs de turnos a colores
        const colorMap: any = {
            1: 'primary',   // Mañana
            2: 'warning',   // Tarde
            3: 'danger',    // Noche
            8: 'medium'     // Libre
        };
        return colorMap[idTimeShift] || 'secondary';
    }

    /** -----------------------------------------------------------------
     * OBTENEMOS EL NÚMERO DE LA SEMANA
     *  -----------------------------------------------------------------
     */

    getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    /** -----------------------------------------------------------------
     * OBTENEMOS EL RANGO DE LA SEMANA
     *  -----------------------------------------------------------------
     */

    getWeekRange(): string {
        const monday = this.getMonday(new Date());
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return `${monday.getDate()} ${this.getMonthName(monday)} - ${sunday.getDate()} ${this.getMonthName(sunday)}`;
    }

    /** -----------------------------------------------------------------
     * OBTENEMOS EL NOMBRE DEL MES
     *  -----------------------------------------------------------------
     */

    getMonthName(date: Date): string {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[date.getMonth()];
    }

    /** -----------------------------------------------------------------
     * NAVEGAMOS A LA SEMANA ANTERIOR
     *  -----------------------------------------------------------------
     */

    previousWeek() {
        this.weekNumber--;
        console.log('Navegación a semana anterior pendiente de implementar');
    }

    /** -----------------------------------------------------------------
     * NAVEGAMOS A LA SEMANA SIGUIENTE
     *  -----------------------------------------------------------------
     */

    nextWeek() {
        this.weekNumber++;
        console.log('Navegación a semana siguiente pendiente de implementar');
    }



}
