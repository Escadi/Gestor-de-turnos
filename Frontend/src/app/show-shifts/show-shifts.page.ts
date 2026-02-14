import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-show-shifts',
  templateUrl: './show-shifts.page.html',
  styleUrls: ['./show-shifts.page.scss'],
  standalone: false
})
export class ShowShiftsPage implements OnInit {
  weekNumber: number = 1;
  weekRange: string = '';
  weekSchedule: any[] = [];
  totalHours: number = 40;
  workDays: number = 5;
  restDays: number = 2;
  workers: any[] = [];
  workerIndex: number = 0;
  isLoading: boolean = false;
  currentWeekDate: Date = new Date(); // Mantiene la fecha actual para calcular la semana

  // -------------------------------------------------------------------------------------
  // CONTADOR PARA EL SALDO DE TIEMPO DEL TRABAJADOR (VACACIONES, FESTIVOS Y DIAS DEBIDOS)
  // -------------------------------------------------------------------------------------
  totalVacationHours: number = 0;
  totalHolidayHours: number = 0;
  totalDebtHours: number = 0;

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
  * VER A TODOS LOS EMPLEADOS                      
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
      /**
       * ------------------------------------------------------------------------------------------------------
       * CARGA A TODOS LOS TRABAJADORES
       * --------------------------------------------------------------------------------------------------------
       */
      await this.getAllWorkers().catch(err => {
        console.error('Error al cargar trabajadores:', err);
        this.workers = []; // Asegurar que workers sea un array vacío si falla
      });

      /**
       * ------------------------------------------------------------------------------------------------------
       * CARGA EL USUARIO DE LOCALSTORAGE Y BUSCA EL ÍNDICE DEL TRABAJADOR LOGUEADO
       * --------------------------------------------------------------------------------------------------------
       */
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        const loggedInWorkerId = currentUser.idWorker;

        /**
         * ------------------------------------------------------------------------------------------------------
         * BUSCA EL ÍNDICE DEL TRABAJADOR LOGUEADO
         * --------------------------------------------------------------------------------------------------------
         */
        const index = this.workers.findIndex(w => w.id === loggedInWorkerId);
        if (index !== -1) {
          this.workerIndex = index;
          console.log('Trabajador logueado encontrado:', this.workers[this.workerIndex]);
        }
      }

      await this.pendingTotalVacacions();

      await this.loadCurrentWeek();
    } catch (error) {
      console.error('Error general en loadData:', error);
    } finally {
      /**
       * ------------------------------------------------------------------------------------------------------
       * PEQUEÑO DELAY PARA QUE SE VEA EL PROGRESS BAR
       * --------------------------------------------------------------------------------------------------------
       */
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

  /**
   * ------------------------------------------------------------------------------------------------------
   * CARGA LOS TURNOS DEL TRABAJADOR
   * --------------------------------------------------------------------------------------------------------
   */
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

    /**
     * -----------------------------------------------------------------
     * OBTENER TURNOS PUBLICADOS DEL TRABAJADOR
     * -----------------------------------------------------------------
     */
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

  /**
   * ------------------------------------------------------------------------------------------------------
   * PROCESA LOS TURNOS PARA LA SEMANA ACTUAL 
   * --------------------------------------------------------------------------------------------------------
   */
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
   * GENERAR DIAS DE LA SEMANA ACTUAL               
   *  -----------------------------------------------------------------
   */
  generateWeekDays() {
    const monday = this.getMonday(this.currentWeekDate);
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
   * GENERAR SEMANA VACIA ESTANDO TODOS CON DIAS DE DESCANSO               
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
   * OBTENIENE EL  LUNES DE LA SEMANA ACTUAL               
   *  -----------------------------------------------------------------
   */

  getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /** -----------------------------------------------------------------
   * CALCULAR HORAS DEL TURNO               
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
   * OBTENER COLOR DEL TURNO UNA VEZ REALICES LOS TURNOS              
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
   * CONTADOR PARA EL SALDO DE TIEMPO DEL TRABAJADOR 
   * (VACACIONES, FESTIVOS Y DIAS DEBIDOS)          
   *  -----------------------------------------------------------------
   */

  pendingTotalVacacions() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      this.myServices.getRequests(currentUser.idWorker).subscribe({
        next: (response: any) => {
          const requests = Array.isArray(response) ? response : [];

          // Resetear contadores
          this.totalVacationHours = 0;
          this.totalHolidayHours = 0;
          this.totalDebtHours = 0;

          // Filtrar solo solicitudes aprobadas
          const approvedRequests = requests.filter(r =>
            r.status === 'Aprobada'
          );

          approvedRequests.forEach(request => {
            // Verificar que tenga fechas
            if (request.timeStart && request.timeEnd) {
              const days = this.calculateDaysBetween(request.timeStart, request.timeEnd);

              // Clasificar según el tipo de solicitud
              // NOTA: Necesitamos confirmar los IDs exactos con el usuario
              switch (request.idType) {
                case 6: // Vacaciones (ID por confirmar)
                  this.totalVacationHours += days;
                  break;
                case 7: // Festivos recuperables (ID por confirmar)
                  this.totalHolidayHours += days;
                  break;
                case 8: // Días debidos (ID por confirmar)
                  this.totalDebtHours += days;
                  break;
              }
            }
          });
        },
        error: (error: any) => {
          console.error('Error cargando solicitudes:', error);
        }
      });
    }
  }
  calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcular diferencia en milisegundos
    const diffTime = Math.abs(end.getTime() - start.getTime());

    // Convertir a días y agregar 1 para incluir ambos días
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  }




  /** -----------------------------------------------------------------
   * IMPLEMENTA LA OBTENCIÓN DEL NUMERO DE LA SEMANA 
   * ACTUAL EMPEZANDO DESDE EL LUNES DE ESA SEMANA               
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
   * IMPLEMENTA LA OBTENCIÓN DEL RANGO DE LA SEMANA ACTUAL DE 
   * LA SEMANA EN LA QUE SE ENCUENTRA EL USUARIO                
   *  -----------------------------------------------------------------
   */
  getWeekRange(): string {
    const monday = this.getMonday(this.currentWeekDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `${monday.getDate()} ${this.getMonthName(monday)} - ${sunday.getDate()} ${this.getMonthName(sunday)}`;
  }

  /** -----------------------------------------------------------------
   * IMPLEMENTA LA OBTENCIÓN DEL NOMBRE DEL MES ACTUAL               
   *  -----------------------------------------------------------------
   */
  getMonthName(date: Date): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[date.getMonth()];
  }

  /** -----------------------------------------------------------------
   * IMPLEMENTA NAVEGAR A LA SEMANA ANTERIOR               
   *  -----------------------------------------------------------------
   */
  previousWeek() {
    this.currentWeekDate.setDate(this.currentWeekDate.getDate() - 7);
    this.weekRange = this.getWeekRange();
    this.loadWorkerShifts();
  }

  /** -----------------------------------------------------------------
   * IMPLEMENTA NAVEGAR A LA SEMANA SIGUIENTE               
   *  -----------------------------------------------------------------
   */
  nextWeek() {
    this.currentWeekDate.setDate(this.currentWeekDate.getDate() + 7);
    this.weekRange = this.getWeekRange();
    this.loadWorkerShifts();
  }



  /** -----------------------------------------------------------------
   * CERRAR SESION                      
   *  -----------------------------------------------------------------
   */
  logout() {
    this.myServices.logout();
  }
}
