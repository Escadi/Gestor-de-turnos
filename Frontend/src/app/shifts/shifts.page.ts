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
  nameFunctions: any = [];


  tiposTurnos: any = []; // Tipos de turnos disponibles

  turnos: any = {};// Objeto para almacenar los turnos: turnos[workerId][fecha] = tipoTurno
  readonly TURNO_LIBRE_ID = 8;

  isGenerating: boolean = false; // Estado de carga para generación con IA

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getAllTimeShifts();
    this.setSemanaDesdeHoy();
  }


  ionViewDidEnter() {
    this.getAllWorkers();
    this.getAllTimeShifts();
    this.getAllNameFunctions();
  }

  /**  -------------------------------------------
   *  |          CONTROLLER WORKERS               |
   *   -------------------------------------------
   */

  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => {
        this.worker = data;
      }
    });
  }


  /**  -------------------------------------------
   *  |          CONTROLLER TIMESHIFTS            |
   *   -------------------------------------------
   */




  getAllTimeShifts() {
    this.myServices.getTimeShifts().subscribe({
      next: (data: any) => {
        this.tiposTurnos = data;
      }
    });
  }

  /**  -------------------------------------------
 *  |         CONTROLLER NAMEFUCTIONS           |
 *   -------------------------------------------
 */

  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    if (!func) return 'Sin función';
    return func.nameCategory;

  }

  getAllNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      }
    });
  }

  /**  -------------------------------------------
  *  |             LOCKED SHIFTS                 |
  *   -------------------------------------------
  */
  async toggleLock(worker: any) {
    const newLockedState = !worker.locked;

    if (newLockedState) {
      const ok = confirm(
        `¿Bloquear los turnos de ${worker.name} para esta semana?\n\nUna vez bloqueados, no se podrán modificar sus turnos.`
      );
      if (!ok) return;
    } else {
      const ok = confirm(
        `¿Desbloquear los turnos de ${worker.name}?\n\nPodrás modificar sus turnos nuevamente.`
      );
      if (!ok) return;
    }

    // Actualizar en el backend
    this.myServices.updateWorker(worker.id, { locked: newLockedState }).subscribe({
      next: (response: any) => {
        worker.locked = newLockedState;
        console.log('Worker lock status updated:', response);
      },
      error: (error: any) => {
        console.error('Error updating worker lock status:', error);
        alert('Error al actualizar el estado de bloqueo. Por favor, intenta de nuevo.');
      }
    });
  }

  /**  -------------------------------------------
  *  |          GENERAR TURNOS CON IA            |
  *   -------------------------------------------
  */
  generateWithAI() {
    if (this.isGenerating) {
      return;
    }

    const ok = confirm(
      '¿Generar turnos automáticamente con IA?\n\nEsto sobrescribirá los turnos actuales de trabajadores no bloqueados.'
    );
    if (!ok) return;

    this.isGenerating = true;

    const dates = this.diasSemana.map(d => d.fechaLarga);

    this.myServices.generateShiftsWithAI(this.worker, this.tiposTurnos, dates).subscribe({
      next: (response: any) => {
        console.log('Respuesta de IA:', response);

        if (response.success && response.turnos) {

          // 🔥 NORMALIZAR TURNOS (CLAVE)
          Object.keys(response.turnos).forEach(workerId => {
            Object.keys(response.turnos[workerId]).forEach(fecha => {
              response.turnos[workerId][fecha] =
                Number(response.turnos[workerId][fecha]);
            });
          });

          // ✅ Ahora sí
          this.turnos = response.turnos;

          alert('✅ Turnos generados exitosamente con IA');
        } else {
          alert('⚠️ ' + (response.message || 'Error al generar turnos'));
        }

        this.isGenerating = false;
      },
      error: (error: any) => {
        console.error('Error al generar con IA:', error);
        alert('❌ Error al conectar con el servicio de IA. Verifica tu conexión.');
        this.isGenerating = false;
      }
    });
  }



  /**  -------------------------------------------
   *  |          CONTROLLER TURNOS DIAS           |
   *  -------------------------------------------
   */

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
    return this.turnos[workerId][fecha] || this.TURNO_LIBRE_ID;
  }

  // Establecer el turno de un trabajador en una fecha específica
  setTurno(workerId: number, fecha: string, tipoTurno: string) {
    // Verificar si el trabajador está bloqueado
    const worker = this.worker.find((w: any) => w.id === workerId);
    if (worker && worker.locked) {
      alert('Este trabajador tiene sus turnos bloqueados. Desbloquea primero para hacer modificaciones.');
      return;
    }

    if (!this.turnos[workerId]) {
      this.turnos[workerId] = {};
    }
    this.turnos[workerId][fecha] = tipoTurno;
    console.log('Turno asignado:', { workerId, fecha, tipoTurno });
  }

}
