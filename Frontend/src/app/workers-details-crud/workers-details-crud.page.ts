import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-workers-details-crud',
  templateUrl: './workers-details-crud.page.html',
  styleUrls: ['./workers-details-crud.page.scss'],
  standalone: false,
})
export class WorkersDetailsCrudPage implements OnInit {

  worker: any = {};
  nameFunctions: any[] = [];
  originalWorker: any = {};
  status: any[] = [];
  accessLevels = ['Admin', 'Dirección', 'Jefe de Administración', 'Supervisor', 'Empleado'];
  filteredFunctions: any[] = [];
  currentUser: any = null;

  constructor(
    private router: Router,
    private myServices: MyServices,
    private alertController: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.worker = { ...navigation.extras.state['worker'] };
      this.originalWorker = { ...navigation.extras.state['worker'] };
    }
  }

  ngOnInit() {
    this.loadCurrentUserData();
  }

  /**--------------------------------------------------------------------------
   * CARGAR DATOS DEL USUARIO ACTUAL CONECTADO
   * --------------------------------------------------------------------------
   */
  loadCurrentUserData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      this.myServices.getWorker(userData.idWorker).subscribe({
        next: (data: any) => {
          this.currentUser = data;
          this.loadNameFunctions();
        },
        error: (err) => {
          console.error('Error loading current user:', err);
          this.currentUser = userData; // Fallback
          this.loadNameFunctions();
        }
      });
    }
  }

  /**--------------------------------------------------------------------------
   * CARGAR NOMBRE DE LAS FUNCIONES Y NORMALIZAR
   * --------------------------------------------------------------------------
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

  /**--------------------------------------------------------------------------
   * FILTRAR FUNCIONES
   * --------------------------------------------------------------------------
   */
  filterFunctions() {
    // Si no hay usuario logueado o no tiene función, mostrar todo por seguridad
    if (!this.currentUser || !this.currentUser.fuction) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    // EL ROLE DE ADMIN LO VE TODO
    const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
    if (userLocal.role === 'admin') {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    const currentLevelStr = this.currentUser.fuction.accessLevel;
    const currentLevelIdx = this.accessLevels.indexOf(currentLevelStr);

    if (currentLevelIdx === -1) {
      this.filteredFunctions = this.nameFunctions;
      return;
    }

    // Solo puede asignar su nivel o inferiores
    this.filteredFunctions = this.nameFunctions.filter(f => {
      const fLevelIdx = this.accessLevels.indexOf(f.accessLevel);
      return fLevelIdx >= currentLevelIdx;
    });
  }

  /**--------------------------------------------------------------------------
   * GUARDAR CAMBIOS EN EL TRABAJADOR SOLO LO ACTUALIZA EL ADMIN 
   * O EL SUPERIOR DEL TRABAJADOR
   * --------------------------------------------------------------------------
   */
  async guardarCambios() {
    // Validar que los campos requeridos estén completos
    if (!this.worker.name || !this.worker.surname || !this.worker.dni) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa los campos obligatorios (Nombre, Apellido, DNI)',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.myServices.updateWorker(this.worker.id, this.worker).subscribe({
      next: async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Trabajador actualizado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/my-workers']);
      },
      error: async (err) => {
        console.error('Error actualizando trabajador:', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar el trabajador. Intenta de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }



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
    if (this.worker && this.worker.status && this.worker.status.id === idStatus) {
      return this.worker.status.name;
    }
    const status = this.status.find((s: any) => s.id === idStatus);
    if (!status) return 'Sin estado';
    return status.name;
  }


}
