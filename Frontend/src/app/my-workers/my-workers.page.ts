import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
  standalone: false,
})
export class MyWorkersPage implements OnInit {

  workers: any[] = [];
  nameFunctions: any = [];
  status: any = [];

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

  // APERTURA DE PAGINA DE DETALLES TRABAJADOR (ACTUALIZAR)
  verDetalles(worker: any) {
    this.router.navigate(['/tab-user/workers-details-crud'], {
      state: { worker: worker }
    });
  }

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
