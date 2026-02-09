import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-request-abences-all',
  templateUrl: './request-abences-all.page.html',
  styleUrls: ['./request-abences-all.page.scss'],
  standalone: false
})
export class RequestAbencesAllPage implements OnInit {

  // Requests data
  requests: any[] = [];
  requestTypes: any[] = [];
  selectedRequest: any = null;

  // Absences data
  abences: any[] = [];
  abenceTypes: any[] = [];
  selectedAbence: any = null;

  // Common data
  currentUser: any = null;
  worker: any[] = [];

  // Modal control for Requests
  isModalOpen: boolean = false;
  isEditModal: boolean = false;

  // Modal control for Absences
  isAbenceModalOpen: boolean = false;
  isEditAbenceModal: boolean = false;

  canSeeAllRequests: boolean = false;

  newRequest = {
    idType: null,
    details: '',
    status: 'Pendiente',
    applicationDate: new Date().toISOString()
  };

  newAbence = {
    idType: null,
    details: '',
    status: 'Pendiente',
    timeStart: new Date().toISOString(),
    timeEnd: new Date().toISOString()
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
    const canViewAll = this.canViewAll;
    this.canSeeAllRequests = canViewAll;


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
    // Load Requests
    this.myServices.getRequests(idWorker, this.currentUser.role).subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });

    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.requestTypes = data,
      error: (err) => console.error('Error cargando tipos:', err)
    });

    // Load Absences
    this.myServices.getAbences(idWorker, this.currentUser.role).subscribe({
      next: (data: any) => this.abences = data,
      error: (err) => console.error('Error cargando ausencias:', err)
    });

    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.abenceTypes = data,
      error: (err) => console.error('Error cargando tipos de ausencias:', err)
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
   * EDITAR PETICION
   * ----------------------------------------------------------------------------------------------
   */
  async updateRequest() {
    if (!this.newRequest.idType) {
      const alert = await this.alertCtrl.create({
        header: 'Campo requerido',
        message: 'Por favor selecciona el tipo de petición.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Actualizando...' });
    await loading.present();

    const updatedRequestData = {
      idWorker: this.currentUser.idWorker,
      idType: this.newRequest.idType,
      details: this.newRequest.details,
      status: 'Pendiente',
      applicationDate: new Date()
    };
    /**
     * ----------------------------------------------------------------------------------------------
     * Actualizar petición
     * ----------------------------------------------------------------------------------------------
     */
    this.myServices.updateRequest(this.selectedRequest.id, updatedRequestData).subscribe({
      next: () => {
        loading.dismiss();
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar petición:', err);
      }
    });
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * ELIMINAR PETICION
   * ----------------------------------------------------------------------------------------------
   */
  async deleteRequest() {
    if (!this.selectedRequest) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta petición?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            this.myServices.deleteRequest(this.selectedRequest.id).subscribe({
              next: () => {
                loading.dismiss();
                this.closeModal();
                this.loadData();
              },
              error: (err) => {
                loading.dismiss();
                console.error('Error al eliminar petición:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * CONTADOR DE PETICIONES PENDIENTES 
   * ----------------------------------------------------------------------------------------------
   */
  /**
   * FILTROS DE FECHA - Solo mostrar peticiones de hoy y ayer
   */
  get filteredRequests(): any[] {
    const status = 'Pendiente';

    return this.requests.filter(r => {
      return r.status === status;
    });
  }

  get filteredAbences(): any[] {
    const status = 'Pendiente';
    return this.abences.filter(a => {
      return a.status === status;
    });
  }

  /**
   * CONTADOR DE PETICIONES PENDIENTES
   */
  get pendingCount(): number {
    return this.filteredRequests.filter(r => r.status === 'Pendiente').length;
  }
  /**
  * CONTADOR DE AUSENCIAS PENDIENTES 
  */
  get abencesPendingCount(): number {
    return this.filteredAbences.filter(a => a.status === 'Pendiente').length;
  }

  /**
   * ABSENCES MODAL FUNCTIONS
   */
  openAbenceModal() {
    this.isAbenceModalOpen = true;
    this.isEditAbenceModal = false;
    this.selectedAbence = null;
    this.newAbence = {
      idType: null,
      details: '',
      status: 'Pendiente',
      timeStart: new Date().toISOString(),
      timeEnd: new Date().toISOString()
    };
  }

  openEditAbenceModal(abence: any) {
    this.isAbenceModalOpen = true;
    this.isEditAbenceModal = true;
    this.selectedAbence = abence;
    this.newAbence = {
      idType: abence.idType,
      details: abence.details,
      status: abence.status,
      timeStart: abence.timeStart,
      timeEnd: abence.timeEnd
    };
  }

  closeAbenceModal() {
    this.isAbenceModalOpen = false;
    this.isEditAbenceModal = false;
    this.selectedAbence = null;
  }

  /**
   * CRUD FOR ABSENCES - CREATE
   */
  async submitAbence() {
    if (!this.newAbence.idType) {
      const alert = await this.alertCtrl.create({
        header: 'Campo requerido',
        message: 'Por favor selecciona el tipo de ausencia.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
    await loading.present();

    const formData = new FormData();
    formData.append('idWorker', this.currentUser.idWorker.toString());
    formData.append('idType', this.newAbence.idType);
    formData.append('details', this.newAbence.details || '');
    formData.append('status', 'Pendiente');
    formData.append('timeStart', this.newAbence.timeStart);
    formData.append('timeEnd', this.newAbence.timeEnd);

    this.myServices.createAbence(formData).subscribe({
      next: () => {
        loading.dismiss();
        this.closeAbenceModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al crear ausencia:', err);
      }
    });
  }

  /**
   * CRUD FOR ABSENCES - UPDATE
   */
  async updateAbence() {
    if (!this.newAbence.idType) {
      const alert = await this.alertCtrl.create({
        header: 'Campo requerido',
        message: 'Por favor selecciona el tipo de ausencia.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Actualizando...' });
    await loading.present();

    const formData = new FormData();
    formData.append('idWorker', this.currentUser.idWorker.toString());
    formData.append('idType', this.newAbence.idType);
    formData.append('details', this.newAbence.details || '');
    formData.append('status', this.newAbence.status);
    formData.append('timeStart', this.newAbence.timeStart);
    formData.append('timeEnd', this.newAbence.timeEnd);

    this.myServices.updateAbence(this.selectedAbence.id, formData).subscribe({
      next: () => {
        loading.dismiss();
        this.closeAbenceModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar ausencia:', err);
      }
    });
  }

  /**
   * CRUD FOR ABSENCES - DELETE
   */
  async deleteAbence() {
    if (!this.selectedAbence) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta ausencia?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            this.myServices.deleteAbence(this.selectedAbence.id).subscribe({
              next: () => {
                loading.dismiss();
                this.closeAbenceModal();
                this.loadData();
              },
              error: (err) => {
                loading.dismiss();
                console.error('Error al eliminar ausencia:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * Determinar si el usuario puede ver todas las peticiones
   * ----------------------------------------------------------------------------------------------
   */
  get canViewAll(): boolean {
    if (!this.currentUser || !this.currentUser.role) return false;
    const role = this.currentUser.role.toLowerCase();
    return role === 'admin' ||
      role === 'supervisor' ||
      role === 'director' ||
      role === 'boss';
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

  logout() {
    this.myServices.logout();
  }

}
