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
    this.router.navigate(['/workers-details-crud'], {
      state: { worker: worker }
    });
  }


  /**  -----------------------------------------
   *  |      LLAMADAS A LOS SERVICIOS GET       |
   *   -----------------------------------------
   */

  // LLAMADA A LOS TRABAJADORES
  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
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


}
