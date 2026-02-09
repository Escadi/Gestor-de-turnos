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
    this.setupMenuForDesktop();

    // Listener para cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.setupMenuForDesktop();
    });
  }

  /**
   * Abre el menú automáticamente en desktop (>= 1000px)
   * En móvil, el menú estará habilitado pero cerrado
   */
  async setupMenuForDesktop() {
    const isDesktop = window.innerWidth >= 1000;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1000;
    const isMobile = window.innerWidth < 768;

    // Siempre habilitar el menú
    await this.menuCtrl.enable(true);

    // Configurar el menú para que no se cierre al hacer click fuera en desktop
    if (isDesktop) {
      // Deshabilitar el cierre automático por click fuera del menú
      await this.menuCtrl.open();

    } else if (isTablet || isMobile) {
      // En móvil/tablet, habilitar gestos y cerrar el menú

      await this.menuCtrl.close();
    }
  }

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

              // Cargar funciones DESPUÉS de tener el worker para poder filtrar
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

  filterFunctions() {
    if (!this.worker || !this.worker.fuction) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    // Si es admin total (role 'admin' en localstorage / token), ve todo
    const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
    if (userLocal.role === 'admin') {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    // Si no es admin, filtramos por nivel de acceso
    const currentLevelStr = this.worker.fuction.accessLevel;
    const currentLevelIdx = this.accessLevels.indexOf(currentLevelStr);

    if (currentLevelIdx === -1) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    // Solo puede ver su nivel o inferiores (índice mayor o igual en accessLevels)
    this.filteredFunctions = this.nameFunctions.filter(f => {
      const fLevelIdx = this.accessLevels.indexOf(f.accessLevel);
      return fLevelIdx >= currentLevelIdx;
    });
  }

  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    return func ? func.name : 'Sin función';
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

  goSanctionsWorker() {
    this.router.navigateByUrl('/sanctions-worker');
  }
  goRequestWorker() {
    this.router.navigateByUrl('/request-worker');
  }
  goAbencesWorker() {
    this.router.navigateByUrl('/abences-worker');
  }

  goLogout() {
    this.myServices.logout();
  }





}
