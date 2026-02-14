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
  readonly TURNO_VACACIONES_ID = 9; // Nuevo ID para vacaciones
  readonly TURNO_SIN_ASIGNAR_ID = 0; // ID para cuando no hay turno asignado
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


  /**
   * --------------------------------------------------------------------------------------
   * FILTRA LOS TRABAJADORES SEGÚN EL TEXTO DE BÚSQUEDA.
   * BUSCA POR: NÚMERO DE EMPLEADO, NOMBRE Y APELLIDO.
   * --------------------------------------------------------------------------------------
   */
  filterUsers(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    this.filterWorkers();
  }

  /**
   * --------------------------------------------------------------------------------------
   * LLAMADAS A LOS GET'S DE LA API
   * --------------------------------------------------------------------------------------
   */

  // Filtering properties
  originalWorkers: any[] = [];
  filteredFunctions: any[] = [];
  selectedFunction: any = null;

  getAllWorkers() {
    const userStr = localStorage.getItem('user');
    let managerId: number | undefined = undefined;

    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role.toLowerCase() !== 'admin') {
        managerId = user.idWorker;
      }
    }

    this.myServices.getWorkers(managerId).subscribe({
      next: (data: any) => {
        this.worker = data;
        this.originalWorkers = [...data]; // Store copy
        this.updateAvailableFunctions(); // Calculate filter options
        this.cargarTurnosExistentes(); // Recargar turnos después de cargar trabajadores
      }
    });
  }

  /**
   * --------------------------------------------------------------------------------------
   * ACTUALIZA LAS FUNCIONES DISPONIBLES EN LA BARRA DE BÚSQUEDA
   * --------------------------------------------------------------------------------------
   */
  updateAvailableFunctions() {
    if (!this.originalWorkers || !this.nameFunctions) return;
    /**
     * --------------------------------------------------------------------------------------
     * OBTENER ID DE FUNCIÓN ÚNICOS DE LOS TRABAJADORES CARGADOS ACTUALMENTE
     * --------------------------------------------------------------------------------------
     */
    const workerFunctionIds = new Set(this.originalWorkers.map(w => w.idFuction));

    /**
     * --------------------------------------------------------------------------------------
     * FILTRAR NAMEFUNCTIONS PARA INCLUIR SOLO AQUELLAS PRESENTES EN LA LISTA DE TRABAJADORES
     * --------------------------------------------------------------------------------------
     */
    this.filteredFunctions = this.nameFunctions.filter((f: any) => workerFunctionIds.has(f.id));
  }

  searchTerm: string = '';

  /**
   * --------------------------------------------------------------------------------------
   * FILTRAR TRABAJADORES POR FUNCIÓN SELECCIONADA
   * --------------------------------------------------------------------------------------
   */
  filterWorkers() {
    let filtered = [...this.originalWorkers];

    if (this.selectedFunction) {
      filtered = filtered.filter(w => w.idFuction === this.selectedFunction);
    }

    /**
     * --------------------------------------------------------------------------------------
     * FILTRAR TRABAJADORES POR BUSQUEDA
     * --------------------------------------------------------------------------------------
     */
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(w =>
        w.id.toString().includes(term) ||
        (w.name + ' ' + w.surname).toLowerCase().includes(term)
      );
    }

    this.worker = filtered;
  }

  /**
   * --------------------------------------------------------------------------------------
   * OBTENER NOMBRES Y APELLIDOS DE UN TRABAJADOR
   * --------------------------------------------------------------------------------------
   */
  getInitials(name: string, surname: string): string {
    if (!name) return '';
    return (name.charAt(0) + (surname ? surname.charAt(0) : '')).toUpperCase();
  }

  /**
   * --------------------------------------------------------------------------------------
   * OBTENER COLOR DE UN TRABAJADOR
   * --------------------------------------------------------------------------------------
   */
  getAvatarColor(id: number): string {
    const colors = ['#5683F5', '#F55683', '#56F5C8', '#F5A656', '#A656F5', '#F55656'];
    return colors[id % colors.length];
  }

  /**
   * --------------------------------------------------------------------------------------
   * OBTENER TURNOS EXISTENTES
   * --------------------------------------------------------------------------------------
   */
  getAllTimeShifts() {
    this.myServices.getTimeShifts().subscribe({
      next: (data: any) => {
        // Filtramos el turno Libre (ID 8) para agregarlo manualmente al final y evitar duplicados
        this.tiposTurnos = data.filter((t: any) => t.id !== this.TURNO_LIBRE_ID);
      }
    });
  }

  /**
   * --------------------------------------------------------------------------------------
   * OBTENER FUNCIONES EXISTENTES
   * --------------------------------------------------------------------------------------
   */
  getAllNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
        this.updateAvailableFunctions();
      }
    });
  }

  /** --------------------------------------------------------------------------------------
   *  CARGAR TURNOS EXISTENTES
   * --------------------------------------------------------------------------------------
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

                // Asignar el objeto completo del turno a la fecha correspondiente
                this.turnos[workerId][shift.date] = {
                  idTimeShift: shift.idTimeShift,
                  locked: shift.locked,
                  state: shift.state
                };
              });
            }
          }
        });

        console.log('Turnos procesados con metadata:', this.turnos);
      },
      error: (error: any) => {
        console.error('Error cargando turnos:', error);
      }
    });
  }


  /** --------------------------------------------------------------------------------------
   *  CONTROLLER NAMEFUCTIONS
   * --------------------------------------------------------------------------------------
   */

  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    if (!func) return 'Sin función';
    return func.name || func.nameCategory; // Fallback just in case

  }

  /** --------------------------------------------------------------------------------------
   *  CREAMOS LOS TURNOS DE LOS TRABAJADORES PARA LA SEMANA SELECCIONADA VIENDOLO
   * SOLAMENTE EL SUPERVISOR Y LOS SUPERIORES A EL TENIENDO EL ESTADO EN (BORRADOR)
   * --------------------------------------------------------------------------------------
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
        const shift = this.turnos[workerId][fecha];
        const idTimeShift = typeof shift === 'object' ? shift.idTimeShift : shift;
        const isLocked = typeof shift === 'object' ? shift.locked : false;

        // Guardar todos los turnos, incluyendo los libres
        if (idTimeShift) {
          shiftsToCreate.push({
            date: fecha,
            idTimeShift: idTimeShift,
            workerId: Number(workerId), // Agregar el ID del trabajador
            state: 'BORRADOR',
            locked: isLocked
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

  /** --------------------------------------------------------------------------------------
   *  PUBLICAMOS LOS TURNOS DE LA SEMANA SELECCIONADA CAMBIANDO SU ESTADO A PUBLICADO
   * VIENDOLO EL TRABAJADOR (PUBLICADO) VIENDOLO EL TRABAJADOR DENTRO DE SHOW SHIFTS
   * --------------------------------------------------------------------------------------
   */
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

  /** --------------------------------------------------------------------------------------
   *  PUBLICAMOS LOS TURNOS DE LA SEMANA SELECCIONADA CAMBIANDO SU ESTADO A PUBLICADO
   * --------------------------------------------------------------------------------------
   */
  async ejecutarPublicacion() {
    const loading = await this.loadingController.create({
      message: 'Publicando turnos...',
      spinner: 'crescent'
    });
    await loading.present();

    /* --------------------------------------------------------------------------------------
    * OBTENER LAS FECHAS DE LA SEMANA ACTUAL
    * --------------------------------------------------------------------------------------
    */
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
  /** 
   * --------------------------------------------------------------------------------------
   * LOCKED SHIFTS (CANDADOS) PARA BLOQUEAR LOS TURNOS DE UN TRABAJADOR 
   * SI TIENE ALGUNA SOLICITUD DE CAMBIO O TURNOS CONSOLIDADOS         
   * -------------------------------------------------------------------------------------
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

  /** --------------------------------------------------------------------------------------
   * CAMBIAMOS EL ESTADO DEL BLOQUEO DE UN TRABAJADOR A BLOQUEADO O NO BLOQUEADO 
   * PARA EL BOTON QUE SE ENCUENTRA EN EL HTML
   * --------------------------------------------------------------------------------------
   */
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

  /** --------------------------------------------------------------------------------------
   * GENERAR TURNOS CON LA IA DE GROQ LLAMANDO AL CONTROLLER DEL BACKEND DESDE
   * EL SERVICE DEL FRONTEND
   * --------------------------------------------------------------------------------------
   */

  /** --------------------------------------------------------------------------------------
   * CONFIRMAR GENERACION CON IA
   * --------------------------------------------------------------------------------------
   */
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

  /** --------------------------------------------------------------------------------------
   * EJECUTAR GENERACION CON IA
   * --------------------------------------------------------------------------------------
   */
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

          /** --------------------------------------------------------------------------------------
           * 🔥 NORMALIZAR Y FUSIONAR TURNOS (Respetando Bloqueos)
           * --------------------------------------------------------------------------------------
           */
          Object.keys(response.turnos).forEach(workerIdKey => {
            const workerId = Number(workerIdKey);

            if (!this.turnos[workerId]) {
              this.turnos[workerId] = {};
            }

            Object.keys(response.turnos[workerIdKey]).forEach(fecha => {
              /** --------------------------------------------------------------------------------------
               * SOLO ACTUALIZAMOS SI EL TURNO NO ESTÁ BLOQUEADO (INDIVIDUALMENTE O POR TRABAJADOR)
               * --------------------------------------------------------------------------------------
               */
              if (!this.isShiftLocked(workerId, fecha)) {
                this.turnos[workerId][fecha] = Number(response.turnos[workerIdKey][fecha]);
              }
            });
          });

          /** --------------------------------------------------------------------------------------
           * NOTA: ELIMINAMOS LA LÍNEA "THIS.TURNOS = RESPONSE.TURNOS;"
           * PARA NO SOBRESCRIBIR A LOS BLOQUEADOS.
           * --------------------------------------------------------------------------------------
           */

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

  /** --------------------------------------------------------------------------------------
   * MOSTRAR ALERTA RESULTADO UNA VEZ FINALIZADO LA OPERACIÓN
   * --------------------------------------------------------------------------------------
   */
  async mostrarAlertaResultado(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }



  /**
   * ---------------------------------------------------------------------------------------------
   * CONTROLLER TURNOS DIAS
   * ---------------------------------------------------------------------------------------------
   */

  setSemanaDesdeHoy() {
    const hoy = new Date();
    const lunes = this.getLunes(hoy);
    this.fechaBase = lunes.toISOString().substring(0, 10);
    this.generarSemana();
  }

  /** --------------------------------------------------------------------------------------
   * FUNCIÓN CLAVE: OBTENER EL LUNES DE LA SEMANA
   * --------------------------------------------------------------------------------------
   */
  getLunes(fecha: Date) {
    const dia = fecha.getDay(); // 0=Dom, 1=Lun, 2=Mar...
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);

    return new Date(fecha.setDate(diff));
  }

  /** --------------------------------------------------------------------------------------
   * GENERAR LA SEMANA AUTOMATICAMENTE UNA VEZ SELECCIONADA LA FECHA BASE
   * --------------------------------------------------------------------------------------
   */
  generarSemana() {
    if (!this.fechaBase) return;

    this.diasSemana = [];

    const nombres = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

    /** --------------------------------------------------------------------------------------
     * EMPEZAMOS DESDE EL LUNES DE ESA SEMANA 
     * --------------------------------------------------------------------------------------
     */
    const fecha = new Date(this.fechaBase);

    for (let i = 0; i < 7; i++) {
      const f = new Date(fecha);
      f.setDate(fecha.getDate() + i); // Sumar i días a la fecha base (Lunes)

      this.diasSemana.push({
        nombre: nombres[f.getDay()],
        numero: f.getDate(),
        fechaLarga: f.toISOString().substring(0, 10)
      });
    }

    /** --------------------------------------------------------------------------------------
     * CARGAR TURNOS EXISTENTES PARA LA NUEVA SEMANA
     * --------------------------------------------------------------------------------------
     */
    this.cargarTurnosExistentes();
  }

  /** --------------------------------------------------------------------------------------
   * OBTENER SOLO EL ID DEL TURNO PARA EL NGMODEL
   * --------------------------------------------------------------------------------------
   */
  getTurno(workerId: number, fecha: string): number {
    const shift = this.getShiftData(workerId, fecha);
    if (!shift) return this.TURNO_SIN_ASIGNAR_ID;
    return typeof shift === 'object' ? shift.idTimeShift : shift;
  }

  private getShiftData(workerId: number, fecha: string): any {
    if (!this.turnos[workerId]) {
      this.turnos[workerId] = {};
    }
    return this.turnos[workerId][fecha];
  }

  isShiftLocked(workerId: number, fecha: string): boolean {
    const worker = this.worker.find((w: any) => w.id === workerId);
    if (worker && worker.locked) return true; // Si el trabajador está bloqueado, todo está bloqueado

    const shift = this.getShiftData(workerId, fecha);
    return typeof shift === 'object' ? !!shift.locked : false;
  }

  /** --------------------------------------------------------------------------------------
   * ESTABLECER EL TURNO DE UN TRABAJADOR EN UNA FECHA ESPECÍFICA
   * --------------------------------------------------------------------------------------
   */
  setTurno(workerId: number, fecha: string, tipoTurno: any) {
    // Verificar si el trabajador está bloqueado
    if (this.isShiftLocked(workerId, fecha)) {
      console.warn('Este turno está bloqueado.');
      return;
    }

    if (!this.turnos[workerId]) {
      this.turnos[workerId] = {};
    }

    /** --------------------------------------------------------------------------------------
     * PRESEERVAMOS EL ESTADO DE BLOQUEO SI YA EXISTÍA
     * --------------------------------------------------------------------------------------
     */
    const existing = this.turnos[workerId][fecha];
    const wasLocked = typeof existing === 'object' ? existing.locked : false;

    this.turnos[workerId][fecha] = {
      idTimeShift: Number(tipoTurno),
      locked: wasLocked,
      state: typeof existing === 'object' ? existing.state : 'BORRADOR'
    };
    console.log('Turno asignado:', { workerId, fecha, tipoTurno, locked: wasLocked });
  }

  logout() {
    this.myServices.logout();
  }

  /**
   * --------------------------------------------------------------------
   * EXPORTAR PDF CON PUPPETEER DE LOS TURNOS DE LA SEMANA 
   * --------------------------------------------------------------------
   */
  async exportPdf() {
    const loading = await this.loadingController.create({
      message: 'Generando PDF...',
      spinner: 'crescent'
    });
    await loading.present();

    this.myServices.generatePdfWithPuppeteer({
      html: this.generateHtml()
    }).subscribe({
      next: (blob: Blob) => {
        loading.dismiss();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `turnos_semana_${this.fechaBase}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error generando PDF:', err);
        loading.dismiss();
        this.alertController.create({
          header: 'Error',
          message: 'No se pudo generar el PDF. Intenta nuevamente.',
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    });
  }

  /** --------------------------------------------------------------------------------------
   * GENERAR HTML PARA EL PDF DE FORMA PERSONALIZADA
   * --------------------------------------------------------------------------------------
   */
  generateHtml(): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const fecha = new Date(this.fechaBase);
    const mesAnio = `${monthNames[fecha.getMonth()]} ${fecha.getFullYear()}`;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
          }
          h2 {
            text-align: center;
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            font-size: 12px;
          }
          th {
            background-color: #6366f1;
            color: white;
            font-weight: bold;
          }
          .empleado {
            text-align: left;
            font-weight: bold;
            background-color: #f5f5f5;
          }
          .turno-libre {
            background-color: #90EE90;
          }
          .turno-manana {
            background-color: #FFD700;
          }
          .turno-tarde {
            background-color: #FFA500;
          }
          .turno-noche {
            background-color: #4169E1;
            color: white;
          }
          .turno-vacaciones {
            background-color: #87CEEB;
          }
          .turno-sin-asignar {
            background-color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <h1>Horario de Turnos</h1>
        <h2>${mesAnio}</h2>
        <table>
          <thead>
            <tr>
              <th>Empleado</th>`;

    /* --------------------------------------------------------------------------------------
    * GENERACIÓN DE LOS ENCABEZADOS DE LOS DÍAS DE LA SEMANA
    * --------------------------------------------------------------------------------------
    */
    this.diasSemana.forEach(d => {
      html += `<th>${d.nombre}<br>${d.numero}</th>`;
    });

    html += `
            </tr>
          </thead>
          <tbody>`;

    /* --------------------------------------------------------------------------------------
    * GENERACIÓN DE LAS FILAS DE LOS TRABAJADORES
    * --------------------------------------------------------------------------------------
    */
    this.worker.forEach((w: any) => {
      html += `<tr><td class="empleado">${w.name} ${w.surname}</td>`;

      this.diasSemana.forEach(d => {
        const turnoId = this.getTurno(w.id, d.fechaLarga);
        let turnoTexto = '-';
        let claseCSS = 'turno-sin-asignar';

        if (turnoId === this.TURNO_LIBRE_ID) {
          turnoTexto = 'Libre';
          claseCSS = 'turno-libre';
        } else if (turnoId === this.TURNO_VACACIONES_ID) {
          turnoTexto = 'Vacaciones';
          claseCSS = 'turno-vacaciones';
        } else if (turnoId !== this.TURNO_SIN_ASIGNAR_ID) {
          const turno = this.tiposTurnos.find((t: any) => t.id === turnoId);
          if (turno) {
            turnoTexto = turno.hours;
            if (turnoId === this.TURNO_MANANA_ID) claseCSS = 'turno-manana';
            else if (turnoId === this.TURNO_TARDE_ID) claseCSS = 'turno-tarde';
            else if (turnoId === this.TURNO_NOCHE_ID) claseCSS = 'turno-noche';
          }
        }

        html += `<td class="${claseCSS}">${turnoTexto}</td>`;
      });

      html += `</tr>`;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>`;

    return html;
  }

}
