import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-request-worker',
  templateUrl: './request-worker.page.html',
  styleUrls: ['./request-worker.page.scss'],
  standalone: false
})
export class RequestWorkerPage implements OnInit {

  requests: any[] = [];
  requestType: any[] = [];
  worker: any[] = [];

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getRequest();
    this.getRequestType();
    this.getWorker();
  }

  /**  -----------------------------------------
    *  |      LLAMADAS A LOS SERVICIOS GET       |
    *   -----------------------------------------
    */

  // LLAMADA A PETICIONES API
  getRequest() {
    this.myServices.getRequests().subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });
  }

  // LLAMADA A TIPOS DE PETICIONES API
  getRequestType() {
    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.requestType = data,
      error: (err) => console.error('Error cargando tipos de peticiones:', err)
    });
  }

  // LLAMADA A TRABAJADORES API
  getWorker() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.worker = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }



  /**  -----------------------------------------
   *  |    LLAMADA A REQUEST TYPE Y A WORKER   |
   *   -----------------------------------------
   */

  getRequestTypeName(idType: number): string {
    const name = this.requestType.find((f: any) => f.id === idType);
    if (!name) return 'Sin tipo de petición';
    return name.typeRequest;
  }

  getWorkerName(idWorker: number): string {
    const name = this.worker.find((f: any) => f.id === idWorker);
    if (!name) return 'Sin trabajador';
    return name.name + ' ' + name.surname;
  }

}
