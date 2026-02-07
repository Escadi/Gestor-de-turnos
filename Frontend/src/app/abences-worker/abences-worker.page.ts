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

  // Modal control
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedAbence: any = null;

  newAbence = {
    typeAbences: '',
    timeStart: new Date().toISOString(),
    timeEnd: new Date().toISOString(),
    details: '',
    status: 'Pendiente',
    capturedImage: null as File | null
  };

  imagePreview: string | null = null;

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
      this.currentUser.role === 'director' ||
      this.currentUser.role === 'boss';

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

  /**
   * ----------------------------------------------------------------------------------------------
   * Modal Functions
   * ----------------------------------------------------------------------------------------------
   */
  openModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedAbence = null;
    this.newAbence = {
      typeAbences: '',
      timeStart: new Date().toISOString(),
      timeEnd: new Date().toISOString(),
      details: '',
      status: 'Pendiente',
      capturedImage: null
    };
    this.imagePreview = null;
  }

  openEditModal(abence: any) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedAbence = abence;
    this.newAbence = {
      typeAbences: abence.typeAbences,
      timeStart: abence.timeStart,
      timeEnd: abence.timeEnd,
      details: abence.details || '',
      status: abence.status,
      capturedImage: null
    };
    // Set image preview if exists
    if (abence.filename) {
      this.imagePreview = `${this.myServices.baseUrl}/public/Images/${abence.filename}`;
    } else {
      this.imagePreview = null;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedAbence = null;
    this.imagePreview = null;
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * Image Handling
   * ----------------------------------------------------------------------------------------------
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newAbence.capturedImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.newAbence.capturedImage = null;
    this.imagePreview = null;
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * CRUD Operations
   * ----------------------------------------------------------------------------------------------
   */
  async submitAbence() {
    if (!this.newAbence.typeAbences || !this.newAbence.timeStart || !this.newAbence.timeEnd) {
      const alert = await this.alertCtrl.create({
        header: 'Campos requeridos',
        message: 'Por favor completa el tipo de ausencia y las fechas.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: this.isEditMode ? 'Actualizando...' : 'Creando...' });
    await loading.present();

    const formData = new FormData();
    formData.append('idWorker', this.currentUser.idWorker.toString());
    formData.append('typeAbences', this.newAbence.typeAbences);
    formData.append('timeStart', this.newAbence.timeStart);
    formData.append('timeEnd', this.newAbence.timeEnd);
    formData.append('details', this.newAbence.details);
    formData.append('status', this.newAbence.status);
    formData.append('applicationDate', new Date().toISOString());

    if (this.newAbence.capturedImage) {
      formData.append('file', this.newAbence.capturedImage);
    }

    const operation = this.isEditMode
      ? this.myServices.updateAbence(this.selectedAbence.id, formData)
      : this.myServices.createAbence(formData);

    operation.subscribe({
      next: () => {
        loading.dismiss();
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al guardar ausencia:', err);
      }
    });
  }

  async deleteAbence() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta ausencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            this.myServices.deleteAbence(this.selectedAbence.id).subscribe({
              next: () => {
                loading.dismiss();
                this.closeModal();
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

  logout() {
    this.myServices.logout();
  }
}
