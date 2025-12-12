import { Component, OnInit } from '@angular/core';
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

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getAllWorkers();
    this.getAllNameFunctions();
  }

  ionViewWillEnter() {
    this.getAllWorkers();
    this.getAllNameFunctions();
  }



  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.workers = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
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

}
