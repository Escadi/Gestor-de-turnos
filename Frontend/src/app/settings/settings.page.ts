import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
  canViewSubordinates: boolean = false;

  accessLevels = ['Admin', 'Dirección', 'Jefe de Administración', 'Supervisor', 'Empleado'];
  filteredFunctions: any[] = [];

  constructor(
    private router: Router,
    private myServices: MyServices,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.loadWorkerData();

  }

  /**
   * ---------------------------------------------------------------------------------------------
   * CARGA LOS DATOS DEL TRABAJADOR DESDE EL LOCAL STORAGE Y LOS TRAEMOS DESDE EL BACKEND
   * DANDONOS LOS DATOS DEL TRABAJADOR COMPLETOS
   * ---------------------------------------------------------------------------------------------
   */
  loadWorkerData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        const idWorker = userData.idWorker;

        if (idWorker) {
          this.myServices.getWorker(idWorker).subscribe({
            next: (data: any) => {
              this.worker = data;
              this.canViewSubordinates = userData.role === 'admin' || (this.worker.fuction && this.worker.fuction.accessLevel !== 'Empleado');
              console.log('Datos completos del trabajador cargados:', this.worker);
              /**
               * ---------------------------------------------------------------------------------------------
               * CARGA LOS DATOS DE LAS FUNCIONES DESPUES DE TENER EL TRABAJADOR PARA PODER FILTRARLO
               * ---------------------------------------------------------------------------------------------
               */
              this.loadNameFunctions();
            },
            error: (err: any) => {
              console.error('Error cargando datos del trabajador:', err);
              this.worker = userData;
              this.canViewSubordinates = userData.role === 'admin';
              this.loadNameFunctions();
            }
          });
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
      }
    }
  }

  /**
   * ---------------------------------------------------------------------------------------------
   * CARGA LOS DATOS DE LAS FUNCIONES DESDE EL BACKEND
   * ---------------------------------------------------------------------------------------------
   */
  loadNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        // Normalizar nombres
        this.nameFunctions = data.map((f: any) => ({
          ...f,
          name: f.name || f.nameCategory
        }));

        this.filterFunctions();
      },
      error: (err) => console.error('Error cargando funciones:', err)
    });
  }

  /**
   * ---------------------------------------------------------------------------------------------
   * FILTRA LAS FUNCIONES SEGUN EL NIVEL DE ACCESO DEL TRABAJADOR
   * ---------------------------------------------------------------------------------------------
   */
  filterFunctions() {
    if (!this.worker || !this.worker.fuction) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }
    /**
     * ---------------------------------------------------------------------------------------------
     * SI ES ADMIN TOTAL (ROLE 'ADMIN' EN LOCALSTORAGE / TOKEN), VE TODO
     * ---------------------------------------------------------------------------------------------
     */
    const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
    if (userLocal.role === 'admin') {
      this.filteredFunctions = this.nameFunctions;
      return;
    }
    /**
     * ---------------------------------------------------------------------------------------------
     * SI NO ES ADMIN, FILTRA POR NIVEL DE ACCESO
     * ---------------------------------------------------------------------------------------------
     */
    const currentLevelStr = this.worker.fuction.accessLevel;
    const currentLevelIdx = this.accessLevels.indexOf(currentLevelStr);

    if (currentLevelIdx === -1) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }
    /**
     * ---------------------------------------------------------------------------------------------
     * SOLO PUEDE VER SU NIVEL O INFERIORES (ÍNDICE MAYOR O IGUAL EN ACCESSLEVELS)
     * ---------------------------------------------------------------------------------------------
     */
    this.filteredFunctions = this.nameFunctions.filter(f => {
      const fLevelIdx = this.accessLevels.indexOf(f.accessLevel);
      return fLevelIdx >= currentLevelIdx;
    });
  }

  /**
   * ---------------------------------------------------------------------------------------------
   * OBTIENE EL NOMBRE DE LA FUNCION
   * ---------------------------------------------------------------------------------------------
   */
  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    return func ? func.name : 'Sin función';
  }

  /**  
   * ---------------------------------------------------------------------------------------------
   * OBTIENE EL NOMBRE DEL STATUS
   * ---------------------------------------------------------------------------------------------
   */
  obtenerNombreStatus(idStatus: number): string {
    const status = this.status.find((s: any) => s.id === idStatus);
    if (!status) return 'Sin estado';
    return status.name;
  }

  /**  
   * ---------------------------------------------------------------------------------------------
   * CONTROLLER NAVIGATION ROUTER PAGE
   * ---------------------------------------------------------------------------------------------
   */

  goLogout() {
    this.myServices.logout();
  }





}
