import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  worker: any = {};
  nameFunctions: any[] = [];
  status: any[] = [];

  constructor(
    private router: Router,
    private myServices: MyServices
  ) { }



  ngOnInit() {
    this.loadNameFunctions();
    this.loadWorkerData();
  }

  /**
   * Carga los datos del trabajador desde localStorage y luego desde el backend
   */
  loadWorkerData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        const idWorker = userData.idWorker;

        if (idWorker) {
          // Cargar datos completos del trabajador desde el backend
          this.myServices.getWorker(idWorker).subscribe({
            next: (data: any) => {
              this.worker = data;
              console.log('Datos completos del trabajador cargados:', this.worker);
            },
            error: (err: any) => {
              console.error('Error cargando datos del trabajador:', err);
              // Si falla, usar los datos básicos del localStorage
              this.worker = userData;
            }
          });
        } else {
          console.warn('No se encontró idWorker en localStorage');
          this.worker = {};
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        this.worker = {};
      }
    } else {
      console.warn('No hay datos de usuario en localStorage');
      this.worker = {};
    }
  }


  /**  
   *  ----------------------------------------------------
   * CONTROLADOR DE FUNCIONES                           
   *  ----------------------------------------------------
   */
  //CARGAMOS TODAS LAS FUNCIONES DESDE LA BASE DE DATOS
  loadNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      },
      error: (err) => console.error('Error cargando funciones:', err)
    });
  }

  //BUSCAMOS ESA FUNCION A RAZON DE LA ID QUE TENGA LA FUNCION
  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    if (!func) return 'Sin función';
    return func.nameCategory;
  }

  /**  
  *  ----------------------------------------------------
  * CONTROLADOR DE STATUS (ESTADO)                           
  *  ----------------------------------------------------
  */
  obtenerNombreStatus(idStatus: number): string {
    const status = this.status.find((s: any) => s.id === idStatus);
    if (!status) return 'Sin estado';
    return status.name;
  }

  /**  
   *  ----------------------------------------------------
   * |        CONTROLLER NAVIGATION ROUTER PAGE           |
   *  ----------------------------------------------------
   */

  goShifts() {
    this.router.navigateByUrl('/shifts');
  }
  goWorkers() {
    this.router.navigateByUrl('/my-workers');
  }
  goLogout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/home');
  }
  goSanctionsWorker() {
    this.router.navigateByUrl('/sanctions-worker');
  }
  goRequestWorker() {
    this.router.navigateByUrl('/request-worker');
  }
  goAbencesWorker() {
    this.router.navigateByUrl('/abences-worker');
  }

  /**
   *  ----------------------------------------------------
   * |        CONTROLLER GET WORKER                       |
   *  ----------------------------------------------------
   */



}
