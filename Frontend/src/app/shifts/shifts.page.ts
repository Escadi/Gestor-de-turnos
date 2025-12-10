import { Component, OnInit } from '@angular/core';
import { MyServices } from 'src/app/services/my-services';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.page.html',
  styleUrls: ['./shifts.page.scss'],
  standalone: false
})
export class ShiftsPage implements OnInit {
  fechaBase: string = '';
  diasSemana: any[] = [];
  worker: any = [];


  tiposTurnos: any = []; // Tipos de turnos disponibles

  turnos: any = {};// Objeto para almacenar los turnos: turnos[workerId][fecha] = tipoTurno

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getAllTimeShifts();
  }


  ionViewDidEnter() {
    this.getAllWorkers();
    this.getAllTimeShifts();
  }

  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => {
        this.worker = data;
      }
    });
  }

  getAllTimeShifts() {
    this.myServices.getTimeShifts().subscribe({
      next: (data: any) => {
        this.tiposTurnos = data;
      }
    });
  }

  setSemanaDesdeHoy() {
    const hoy = new Date();
    const lunes = this.getLunes(hoy);
    this.fechaBase = lunes.toISOString().substring(0, 10);
    this.generarSemana();
  }

  //Función clave: obtener el lunes de la semana
  getLunes(fecha: Date) {
    const dia = fecha.getDay(); // 0=Dom, 1=Lun, 2=Mar...
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);

    return new Date(fecha.setDate(diff));
  }

  generarSemana() {
    if (!this.fechaBase) return;

    this.diasSemana = [];

    const fecha = new Date(this.fechaBase);

    const nombres = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

    for (let i = 0; i < 7; i++) {
      const f = new Date(fecha);
      f.setDate(f.getDate() + i);

      this.diasSemana.push({
        nombre: nombres[f.getDay()],
        numero: f.getDate(),
        fechaLarga: f.toISOString().substring(0, 10)
      });
    }
  }

  // Obtener el turno de un trabajador en una fecha específica
  getTurno(workerId: number, fecha: string): string {
    if (!this.turnos[workerId]) {
      this.turnos[workerId] = {};
    }
    return this.turnos[workerId][fecha] || 'libre';
  }

  // Establecer el turno de un trabajador en una fecha específica
  setTurno(workerId: number, fecha: string, tipoTurno: string) {
    if (!this.turnos[workerId]) {
      this.turnos[workerId] = {};
    }
    this.turnos[workerId][fecha] = tipoTurno;
    console.log('Turno asignado:', { workerId, fecha, tipoTurno });
  }

}
