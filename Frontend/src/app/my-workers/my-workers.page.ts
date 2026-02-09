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
 * CONTROLADOR: MyWorkersPage
 * Muestra el listado de empleados a cargo.
 * Proporciona resúmenes de estado y acceso a herramientas de gestión individual.
 */
export class MyWorkersPage implements OnInit {

  workers: any[] = [];
  nameFunctions: any = [];
  status: any = [];

  /**
   * Genera un resumen visual (Badges) de los estados de los trabajadores.
   * Ej: 3 Activos, 1 Baja, 0 Vacaciones.
   */
  getStatusSummary() {
    if (!this.workers || this.workers.length === 0) return [];

    const summary: { name: string, count: number, color: string }[] = [];
    const counts: { [key: string]: number } = {};

    this.workers.forEach(w => {
      const statusName = w.status?.name || 'Inactivo';
      counts[statusName] = (counts[statusName] || 0) + 1;
    });

    // Colores para los estados comunes
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

    // Si solo hay un estado y es "Activo", o si hay varios, devolvemos según la lógica del usuario:
    // "solo si hay alguno... si no solo activos" -> Interpretamos como mostrar los que tengan > 0.
    // Como ya filtramos al iterar Object.keys de counts, ya solo tenemos los que tienen > 0.

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


  /**  ----------------------------------------------
   *  | LLAMADAS A LOS ROUTER PARA ABRIR PAGINAS     |
   *   ---------------------------------------------
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
   * Navega a la pantalla de actividad (fichajes, horario) del trabajador.
   */
  // VER ACTIVIDAD (FICHAJES Y HORARIO)
  verActividad(worker: any) {
    this.router.navigate(['/tab-user/worker-activity'], {
      state: { worker: worker }
    });
  }


  /**  -----------------------------------------
   *  |      LLAMADAS A LOS SERVICIOS GET       |
   *   -----------------------------------------
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
      next: (data: any) => this.workers = data,
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

  logout() {
    this.myServices.logout();
  }
}
