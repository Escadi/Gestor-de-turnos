import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-request-worker',
  templateUrl: './request-worker.page.html',
  styleUrls: ['./request-worker.page.scss'],
  standalone: false
})
export class RequestWorkerPage implements OnInit {

  requests: any[] = [];
  requestTypes: any[] = [];
  currentUser: any = null;
  worker: any[] = [];
  selectedRequest: any = null;

  // Modal control
  isModalOpen: boolean = false;
  isEditModal: boolean = false;


  newRequest = {
    idType: null,
    details: '',
    status: 'Pendiente',
    applicationDate: new Date().toISOString()
  };

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
    }
  }

  loadData() {
    if (!this.currentUser) return;
    /**
     * ----------------------------------------------------------------------------------------------
     * Determinar si el usuario puede ver todas las peticiones según su rol
     * ----------------------------------------------------------------------------------------------
     */
    const canViewAll = this.currentUser.role === 'admin' ||
      this.currentUser.role === 'supervisor' ||
      this.currentUser.role === 'director';

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
    this.myServices.getRequests(idWorker, this.currentUser.role).subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });

    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.requestTypes = data,
      error: (err) => console.error('Error cargando tipos:', err)
    });
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * MODALS FUNCTIONS
   * ----------------------------------------------------------------------------------------------
   */
  openModal() {
    this.isModalOpen = true;
    this.isEditModal = false;
    this.selectedRequest = null;
    this.newRequest = {
      idType: null,
      details: '',
      status: 'Pendiente',
      applicationDate: new Date().toISOString()
    };
  }

  openEditModal(request: any) {
    this.isModalOpen = true;
    this.isEditModal = true;
    this.selectedRequest = request;
    this.newRequest = {
      idType: request.idType,
      details: request.details,
      status: request.status,
      applicationDate: request.applicationDate
    };
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditModal = false;
    this.selectedRequest = null;

  }

  /**
   * ----------------------------------------------------------------------------------------------
   * CRUD OPERATIONS
   * CREAR PETICION
   * ----------------------------------------------------------------------------------------------
   */
  async submitRequest() {
    if (!this.newRequest.idType) {
      const alert = await this.alertCtrl.create({
        header: 'Campo requerido',
        message: 'Por favor selecciona el tipo de petición.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
    await loading.present();

    const newRequestData = {
      idWorker: this.currentUser.idWorker,
      idType: this.newRequest.idType,
      details: this.newRequest.details,
      status: 'Pendiente',
      applicationDate: new Date()
    };
    /**
     * ----------------------------------------------------------------------------------------------
     * Crear petición
     * ----------------------------------------------------------------------------------------------
     */
    this.myServices.createRequest(newRequestData).subscribe({
      next: () => {
        loading.dismiss();
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al crear petición:', err);
      }
    });
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * Contador de peticiones pendientes
   * ----------------------------------------------------------------------------------------------
   */
  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'Pendiente').length;
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
   * Obtener nombre del tipo de petición
   * ----------------------------------------------------------------------------------------------
   */
  getTypeName(idType: number): string {
    const type = this.requestTypes.find(t => t.id === idType);
    return type ? type.typeRequest : 'Sin tipo';
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
