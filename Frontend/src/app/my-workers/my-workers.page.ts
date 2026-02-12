import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
  standalone: false,
})
/**
 * ------------------------------------------------------------------------------------------
 * CONTROLADOR: MyWorkersPage
 * MUESTRA EL LISTADO DE EMPLEADOS A CARGO.
 * PROPORCIONA RESÚMENES DE ESTADO Y ACCESO A HERRAMIENTAS DE GESTIÓN INDIVIDUAL.
 * ------------------------------------------------------------------------------------------
 */
export class MyWorkersPage implements OnInit {

  workers: any[] = [];
  filteredWorkers: any[] = [];
  nameFunctions: any = [];
  status: any = [];

  /**
   * ------------------------------------------------------------------------------------------
   * GENERA UN RESUMEN VISUAL (BADGES) DE LOS ESTADOS DE LOS TRABAJADORES.
   * EJ: 3 ACTIVOS, 1 BAJA, 0 VACACIONES.
   * ------------------------------------------------------------------------------------------
   */
  getStatusSummary() {
    if (!this.filteredWorkers || this.filteredWorkers.length === 0) return [];

    const summary: { name: string, count: number, color: string }[] = [];
    const counts: { [key: string]: number } = {};

    this.filteredWorkers.forEach(w => {
      const statusName = w.status?.name || 'Inactivo';
      counts[statusName] = (counts[statusName] || 0) + 1;
    });

    /* ------------------------------------------------------------------------------------------
     * COLORES PARA LOS ESTADOS COMUNES
     * ------------------------------------------------------------------------------------------
     */
    const colorMap: { [key: string]: string } = {
      'Activo': 'success',
      'Baja': 'danger',
      'Vacaciones': 'tertiary',
      'Permiso': 'warning',
      'Inactivo': 'medium'
    };

    Object.keys(counts).forEach(key => {
      summary.push({
        name: key,
        count: counts[key],
        color: colorMap[key] || 'primary'
      });
    });

    /**
     * ------------------------------------------------------------------------------------------
     * SI SOLO HAY UN ESTADO Y ES "ACTIVO", O SI HAY VARIOS, DEVOLVEMOS SEGÚN LA LÓGICA DEL USUARIO:
     * "SOLO SI HAY ALGUNO... SI NO SOLO ACTIVOS" -> INTERPRETAMOS COMO MOSTRAR LOS QUE TENGAN > 0.
     * COMO YA FILTRAMOS AL ITERAR OBJECT.KEYS DE COUNTS, YA SOLO TENEMOS LOS QUE TENGAN > 0.
     * ------------------------------------------------------------------------------------------
     */
    return summary;
  }

  constructor(
    private myServices: MyServices,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllWorkers();
    this.getAllNameFunctions();
  }

  ionViewWillEnter() {
    this.getAllWorkers();
    this.getAllNameFunctions();
  }





  /**
   * ------------------------------------------------------------------------------------------
   * LLAMADAS A LOS ROUTER PARA ABRIR PAGINAS
   * ------------------------------------------------------------------------------------------
   */

  /**
   * Navega a la pantalla de edición/detalles del trabajador.
   * Pasa el objeto 'worker' completo a través del state del router.
   */
  // APERTURA DE PAGINA DE DETALLES TRABAJADOR (ACTUALIZAR)
  verDetalles(worker: any) {
    this.router.navigate(['/tab-user/workers-details-crud'], {
      state: { worker: worker }
    });
  }

  /**
   * -----------------------------------------------------------------------------------------
   * NAVEGA A LA PANTALLA DE ACTIVIDAD (FICHAJES, HORARIO) DEL TRABAJADOR.
   * -----------------------------------------------------------------------------------------
   */

  // VER ACTIVIDAD (FICHAJES Y HORARIO)
  verActividad(worker: any) {
    this.router.navigate(['/tab-user/worker-activity'], {
      state: { worker: worker }
    });
  }


  /**
   * ------------------------------------------------------------------------------------------
   * LLAMADAS A LOS SERVICIOS GET
   * ------------------------------------------------------------------------------------------
   */

  /**
   * Obtiene la lista de trabajadores desde el servicio.
   * Si el usuario no es 'admin', filtra automáticamente por su ID como managerId.
   */
  // LLAMADA A LOS TRABAJADORES
  getAllWorkers() {
    const userStr = localStorage.getItem('user');
    let managerId: number | undefined = undefined;

    if (userStr) {
      const user = JSON.parse(userStr);
      // Si no es admin global, filtramos por subordinados
      if (user.role.toLowerCase() !== 'admin') {
        managerId = user.idWorker;
      }
    }

    this.myServices.getWorkers(managerId).subscribe({
      next: (data: any) => {
        this.workers = data;
        this.filteredWorkers = data;
      },
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }

  // LLAMADA A LAS FUNCIONES
  getAllNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      }
    });
  }

  /**  -------------------------------------------
   *  |         CONTROLLER NAMEFUCTIONS           |
   *   -------------------------------------------
   */

  // OBTENER EL NOMBRE DE LA FUNCION A PARTIR DE LA ID QUE TIENE
  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    if (!func) return 'Sin función';
    return func.nameCategory;
  }


  /**  
   *  -------------------------------------------
   * |         CONTROLLER STATUS                 |
   *  -------------------------------------------
   */

  // OBTENER EL NOMBRE DEL ESTADO A PARTIR DE LA ID QUE TIENE
  obtenerNombreStatus(idStatus: number): string {
    const status = this.status.find((s: any) => s.id === idStatus);
    if (!status) return 'Sin estado';
    return status.name;
  }

  /**  
   *  -------------------------------------------
   * |         FILTER WORKERS                    |
   *  -------------------------------------------
   */

  /**
   * Filtra los trabajadores según el texto de búsqueda.
   * Busca por: número de empleado, nombre, apellido y función.
   */
  filterWorkers(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || '';

    if (!searchTerm.trim()) {
      // Si no hay búsqueda, mostrar todos
      this.filteredWorkers = this.workers;
      return;
    }

    this.filteredWorkers = this.workers.filter(worker => {
      const id = worker.id?.toString().toLowerCase() || '';
      const name = worker.name?.toLowerCase() || '';
      const surname = worker.surname?.toLowerCase() || '';
      const functionName = worker.fuction?.name?.toLowerCase() || '';

      return id.includes(searchTerm) ||
        name.includes(searchTerm) ||
        surname.includes(searchTerm) ||
        functionName.includes(searchTerm);
    });
  }

  logout() {
    this.myServices.logout();
  }
}
