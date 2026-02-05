import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-abences-worker',
  templateUrl: './abences-worker.page.html',
  styleUrls: ['./abences-worker.page.scss'],
  standalone: false
})
export class AbencesWorkerPage implements OnInit {


  abences: any[] = [];
  requestTypes: any[] = [];
  currentUser: any = null;
  worker: any[] = [];

  constructor(
    private myServices: MyServices,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadData();
      this.getAllWorkers();
    }
  }


  /**
   * ----------------------------------------------------------------------------------------------
   * CARGAR COLORES DE LOS CARDS A RAZON DEL STATUS
   * ----------------------------------------------------------------------------------------------
   */
  getColor(status: string): string {
    switch (status) {
      case 'Pendiente': return 'status-pending';
      case 'Aprobada': return 'status-accepted';
      case 'Aceptada': return 'status-accepted';
      case 'Rechazada': return 'status-rejected';
      default: return '';
    }
  }


  loadData() {
    if (!this.currentUser) {
      console.error('currentUser is null, cannot load absences');
      return;
    }
    console.log('currentUser:', this.currentUser);
    /**
     * ----------------------------------------------------------------------------------------------
     * Determinar si el usuario puede ver todas las peticiones según su rol
     * ----------------------------------------------------------------------------------------------
     */
    const canViewAll = this.currentUser.role === 'admin' ||
      this.currentUser.role === 'supervisor' ||
      this.currentUser.role === 'director';

    console.log('canViewAll:', canViewAll, '| role:', this.currentUser.role);

    /**
     * ----------------------------------------------------------------------------------------------
     * Si puede ver todas, no pasamos idWorker; si es trabajador, pasamos su idWorker
     * ----------------------------------------------------------------------------------------------
     */
    const idWorker = canViewAll ? undefined : this.currentUser.idWorker;

    /**
     * ----------------------------------------------------------------------------------------------
     * Siempre pasamos el rol para que el backend pueda validar
     * ----------------------------------------------------------------------------------------------
     */
    this.myServices.getAbences(idWorker, this.currentUser.role).subscribe({
      next: (data: any) => {
        console.log('Absences received from API:', data);
        this.abences = data;
      },
      error: (err) => console.error('Error al cargar datos de ese trabajador:', err)
    });

    this.myServices.getAbencesAll().subscribe({
      next: (data: any) => this.requestTypes = data,
      error: (err) => console.error('Error al cargar los tipos de ausencias:', err)
    });
  }

  /**
  * ----------------------------------------------------------------------------------------------
  * Contador de peticiones pendientes
  * ----------------------------------------------------------------------------------------------
  */
  get pendingCount(): number {
    return this.abences.filter(r => r.status === 'Pendiente').length;
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * Determinar si el usuario puede ver todas las peticiones
   * ----------------------------------------------------------------------------------------------
   */
  get canViewAll(): boolean {
    return this.currentUser?.role === 'admin' ||
      this.currentUser?.role === 'supervisor' ||
      this.currentUser?.role === 'director';
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * Obtener nombre del trabajador
   * ----------------------------------------------------------------------------------------------
   */
  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.worker = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }

  getWorkerName(request: any): string {
    if (request.worker) {
      return `${request.worker.name} ${request.worker.surname}`;
    }
    return 'Trabajador desconocido';
  }
}
