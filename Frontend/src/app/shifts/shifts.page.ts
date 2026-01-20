import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
  turnos: any = {}; // Objeto para almacenar los turnos: turnos[workerId][fecha] = tipoTurno
  readonly TURNO_LIBRE_ID = 8;
  readonly TURNO_MANANA_ID = 1;
  readonly TURNO_TARDE_ID = 2;
  readonly TURNO_NOCHE_ID = 3;
  isGenerating: boolean = false; // Estado de carga para generación con IA
  timeLoading: number = 3000; // Tiempo de carga en ms



  constructor(
    private myServices: MyServices,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getAllTimeShifts();
    this.setSemanaDesdeHoy();
  }


  ionViewDidEnter() {
    this.getAllWorkers();
    this.getAllTimeShifts();
    this.getAllNameFunctions();
    this.cargarTurnosExistentes(); // Cargar turnos existentes al entrar
  }

  /**  -------------------------------------------
   *  |     LLAMADAS A LOS GET´S DE LA API        |
   *   -------------------------------------------
   */

  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => {
        this.worker = data;
        this.cargarTurnosExistentes(); // Recargar turnos después de cargar trabajadores
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

  getAllNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      }
    });
  }

  /**  -------------------------------------------
   *  |         CARGAR TURNOS EXISTENTES          |
   *   -------------------------------------------
   */

  cargarTurnosExistentes() {
    // Solo cargar si tenemos fechas y trabajadores
    if (this.diasSemana.length === 0 || this.worker.length === 0) {
      return;
    }

    const dates = this.diasSemana.map(d => d.fechaLarga);

    this.myServices.getShifts().subscribe({
      next: (response: any) => {
        const shifts = Array.isArray(response) ? response : [];
        console.log('Turnos cargados:', shifts);

        // Limpiar turnos actuales
        this.turnos = {};

        // Procesar cada turno y asignarlo al trabajador correspondiente
        shifts.forEach((shift: any) => {
          // Verificar que el turno esté en el rango de fechas actual
          if (dates.includes(shift.date)) {
            // Buscar la asociación con el trabajador
            if (shift.workerShifts && shift.workerShifts.length > 0) {
              shift.workerShifts.forEach((ws: any) => {
                const workerId = ws.idWorker;

                // Inicializar objeto del trabajador si no existe
                if (!this.turnos[workerId]) {
                  this.turnos[workerId] = {};
                }

                // Asignar el turno a la fecha correspondiente
                this.turnos[workerId][shift.date] = shift.idTimeShift;
              });
            }
          }
        });

        console.log('Turnos procesados:', this.turnos);
      },
      error: (error: any) => {
        console.error('Error cargando turnos:', error);
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

  /**  --------------------------------------
*  |         CONTROLLER SHIFTS                |
*   ------------------------------------------
*/

  async crearTurnos() {
    if (!this.turnos || Object.keys(this.turnos).length === 0) {
      this.mostrarError('Error', 'No hay turnos para guardar');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando turnos...',
      spinner: 'crescent'
    });
    await loading.present();

    // Convertir el objeto turnos a un array de shifts
    const shiftsToCreate: any[] = [];

    Object.keys(this.turnos).forEach(workerId => {
      Object.keys(this.turnos[workerId]).forEach(fecha => {
        const idTimeShift = this.turnos[workerId][fecha];

        // Guardar todos los turnos, incluyendo los libres
        if (idTimeShift) {
          shiftsToCreate.push({
            date: fecha,
            idTimeShift: idTimeShift,
            workerId: Number(workerId), // Agregar el ID del trabajador
            state: 'BORRADOR',
            locked: false
          });
        }
      });
    });

    if (shiftsToCreate.length === 0) {
      await loading.dismiss();
      this.mostrarError('Error', 'No hay turnos válidos para guardar');
      return;
    }

    // Crear todos los turnos en una sola llamada a la API
    this.myServices.bulkCreateShifts(shiftsToCreate).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        this.mostrarAlertaResultado(
          'Turnos guardados',
          `Se guardaron ${response.count} turnos en modo borrador. Usa el botón "Publicar" para hacerlos visibles a los trabajadores.`
        );
      },
      error: async (error: any) => {
        await loading.dismiss();
        console.error('Error creando turnos:', error);
        this.mostrarError('Error', 'No se pudieron guardar los turnos. Intenta nuevamente.');
      }
    });
  }

  async publicarTurnos() {
    const alert = await this.alertController.create({
      header: 'Publicar turnos',
      message: '¿Deseas publicar los turnos de esta semana? Los trabajadores podrán verlos una vez publicados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Publicar',
          cssClass: 'alert-confirm',
          handler: () => {
            this.ejecutarPublicacion();
          }
        }
      ]
    });

    await alert.present();
  }

  async ejecutarPublicacion() {
    const loading = await this.loadingController.create({
      message: 'Publicando turnos...',
      spinner: 'crescent'
    });
    await loading.present();

    // Obtener las fechas de la semana actual
    const dates = this.diasSemana.map(d => d.fechaLarga);

    this.myServices.publishShifts(dates).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        this.mostrarAlertaResultado(
          'Turnos publicados',
          `Se publicaron ${response.count} turno(s) exitosamente. Los trabajadores ya pueden verlos.`
        );
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.mostrarError(
          'Error',
          'No se pudieron publicar los turnos. Intenta nuevamente.'
        );
        console.error('Error publicando turnos:', error);
      }
    });
  }




  /** --------------------------------------------
  *  |         LOCKED SHIFTS (CANDADOS)           |
  *   --------------------------------------------
  */

  async confirmarLock(worker: any) {
    const alert = await this.alertController.create({
      header: worker.locked ? 'Desbloquear turnos' : 'Bloquear turnos',
      cssClass: worker.locked ? 'alert-danger' : 'alert-success',
      message: worker.locked
        ? `¿Deseas desbloquear los turnos de ${worker.name}?\nPodrás modificarlos nuevamente.`
        : `¿Deseas bloquear los turnos de ${worker.name} para esta semana?\nUna vez bloqueados, no se podrán modificar.`,
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'cancel',
          role: 'cancel'
        },
        {
          text: worker.locked ? 'Desbloquear' : 'Bloquear',
          cssClass: 'confirm',
          handler: () => {
            this.cambiarEstadoLock(worker);
          }
        }
      ]
    });

    await alert.present();
  }

  cambiarEstadoLock(worker: any) {
    const newLockedState = !worker.locked;

    this.myServices.updateWorker(worker.id, { locked: newLockedState }).subscribe({
      next: (response: any) => {
        worker.locked = newLockedState;
        console.log('✅ Worker lock actualizado:', response);
      },
      error: (error: any) => {
        console.error('❌ Error actualizando lock:', error);
        this.mostrarError(
          'Error',
          'No se pudo actualizar el estado del bloqueo. Intenta nuevamente.'
        );
      }
    });
  }

  async mostrarError(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  /**  -------------------------------------------
  *  |          GENERAR TURNOS CON IA            |
  *   -------------------------------------------
  */

  // CONFIRMAR GENERACION CON IA
  async confirmarGenerarIA() {
    const alert = await this.alertController.create({
      header: 'Generar turnos con IA',
      message: `
      ¿Deseas generar los turnos automáticamente?
      Se sobrescribirán los turnos de trabajadores no bloqueados
    `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Generar',
          cssClass: 'alert-confirm',
          handler: () => {
            this.ejecutarGeneracionIA();
          }
        }
      ]
    });

    await alert.present();
  }

  // EJECUTAR GENERACION CON IA
  async ejecutarGeneracionIA() {
    this.isGenerating = true;

    const loading = await this.loadingController.create({
      message: 'Generando turnos con IA...',
      spinner: 'crescent',
      backdropDismiss: false
    });

    await loading.present();

    const dates = this.diasSemana.map(d => d.fechaLarga);

    this.myServices.generateShiftsWithAI(
      this.worker,
      this.tiposTurnos,
      dates
    ).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        this.isGenerating = false;

        if (response.success && response.turnos) {

          // 🔥 NORMALIZAR TURNOS
          Object.keys(response.turnos).forEach(workerId => {
            Object.keys(response.turnos[workerId]).forEach(fecha => {
              response.turnos[workerId][fecha] =
                Number(response.turnos[workerId][fecha]);
            });
          });

          this.turnos = response.turnos;

          this.mostrarAlertaResultado(
            'Turnos generados',
            'Los turnos se generaron correctamente con IA'
          );
        } else {
          this.mostrarAlertaResultado(
            'Error',
            response.message || 'Error al generar los turnos'
          );
        }
      },
      error: async (error: any) => {
        await loading.dismiss();
        this.isGenerating = false;

        this.mostrarAlertaResultado(
          'Error de conexión',
          '❌ No se pudo conectar con el servicio de IA'
        );

        console.error(error);
      }
    });
  }

  // MOSTRAR ALERTA RESULTADO UNA VEZ FINALIZADO LA OPERACIÓN
  async mostrarAlertaResultado(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
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

    // Cargar turnos existentes para la nueva semana
    this.cargarTurnosExistentes();
  }

  // Obtener el turno de un trabajador en una fecha específica
  getTurno(workerId: number, fecha: string): number {
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
