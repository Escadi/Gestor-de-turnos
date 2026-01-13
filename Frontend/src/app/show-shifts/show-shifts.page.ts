import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.loadData();
  }

  /**
   *  -------------------------------------------------------------------------------------
   * |                    CARGA INICIAL DE DATOS CON PROGRESS BAR                          |
   *  -------------------------------------------------------------------------------------
   */
  async loadData() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.getAllWorkers().catch(err => {
          console.error('Error al cargar trabajadores:', err);
          this.workers = []; // Asegurar que workers sea un array vacío si falla
        }),
        this.loadCurrentWeek()
      ]);
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
   * |        VISTA CON DATOS DE EJEMPLO PARA PROBAR LA VISTA          |
   *  -----------------------------------------------------------------
   */
  loadCurrentWeek() {
    this.weekNumber = this.getWeekNumber(new Date());
    this.weekRange = this.getWeekRange();

    this.weekSchedule = [
      { dayName: 'Lunes', date: '30 Dic', isToday: false, shift: { hours: '09:00 - 17:00', type: 'Mañana', color: 'primary' } },
      { dayName: 'Martes', date: '31 Dic', isToday: false, shift: { hours: '09:00 - 17:00', type: 'Mañana', color: 'primary' } },
      { dayName: 'Miércoles', date: '01 Ene', isToday: false, shift: { hours: '09:00 - 17:00', type: 'Mañana', color: 'primary' } },
      { dayName: 'Jueves', date: '02 Ene', isToday: false, shift: { hours: '14:00 - 22:00', type: 'Tarde', color: 'warning' } },
      { dayName: 'Viernes', date: '03 Ene', isToday: true, shift: { hours: '14:00 - 22:00', type: 'Tarde', color: 'warning' } },
      { dayName: 'Sábado', date: '04 Ene', isToday: false },
      { dayName: 'Domingo', date: '05 Ene', isToday: false }
    ];
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  getWeekRange(): string {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() || 7) + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `${monday.getDate()} ${this.getMonthName(monday)} - ${sunday.getDate()} ${this.getMonthName(sunday)}`;
  }

  getMonthName(date: Date): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[date.getMonth()];
  }

  previousWeek() {
    // TODO: Cargar datos de la semana anterior
    this.weekNumber--;
  }

  nextWeek() {
    // TODO: Cargar datos de la semana siguiente
    this.weekNumber++;
  }


  /**-----------------------------------------------------------------
  * |                  VER A TODOS LOS EMPLEADOS                      |
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
  nextWorker() {
    if (this.workers.length === 0) return;
    this.workerIndex++;
    if (this.workerIndex >= this.workers.length) {
      this.workerIndex = 0;
    }
  }
  previousWorker() {
    if (this.workers.length === 0) return;
    this.workerIndex--;
    if (this.workerIndex < 0) {
      this.workerIndex = this.workers.length - 1;
    }
  }
}
