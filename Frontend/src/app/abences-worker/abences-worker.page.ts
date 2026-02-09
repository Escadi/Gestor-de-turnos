import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-abences-worker',
  templateUrl: './abences-worker.page.html',
  styleUrls: ['./abences-worker.page.scss'],
  standalone: false
})
/**
 * CONTROLADOR: AbencesWorkerPage
 * Gestiona la visualización y operaciones CRUD de las ausencias.
 * Soporta roles para mostrar solo las propias o las de subordinados.
 */
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

  /**
   * Ciclo de vida: Inicialización del componente.
   * Carga el usuario actual y solicita los datos iniciales.
   */
  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadData();
      this.getAllWorkers();
    }
  }


  /**
   * Devuelve la clase CSS correspondiente al estado de la solicitud.
   * @param status Estado de la ausencia (Pendiente, Aprobada, Rechazada)
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


  /**
   * Carga la lista de ausencias desde el backend.
   * Aplica filtros según el rol del usuario (Admin ve todas, Empleado solo suyas).
   */
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
    const canViewAll = this.canViewAll;

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
    if (!this.currentUser || !this.currentUser.role) return false;
    const role = this.currentUser.role.toLowerCase();
    return role === 'admin' ||
      role === 'supervisor' ||
      role === 'director' ||
      role === 'boss';
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * Obtener nombre del trabajador
   * ----------------------------------------------------------------------------------------------
   */
  /**
   * Obtiene la lista completa de trabajadores para mostrar nombres en las tarjetas.
   */
  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.worker = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }

  /**
   * Helper para obtener el nombre completo de un trabajador asociado a una solicitud.
   */
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
  /**
   * Abre el modal para CREAR una nueva ausencia.
   * Reinicia el formulario.
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

  /**
   * Abre el modal para EDITAR una ausencia existente.
   * Carga los datos de la ausencia seleccionada en el formulario.
   */
  openEditModal(abence: any) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedAbence = abence;

    // Fix for "Invalid Time" error: ensure date strings have 'T' separator
    const startTime = typeof abence.timeStart === 'string' ? abence.timeStart.replace(' ', 'T') : abence.timeStart;
    const endTime = typeof abence.timeEnd === 'string' ? abence.timeEnd.replace(' ', 'T') : abence.timeEnd;

    this.newAbence = {
      typeAbences: abence.typeAbences,
      timeStart: startTime,
      timeEnd: endTime,
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

  /**
   * Cierra el modal y limpia las variables temporales.
   */
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
  /**
   * Envía los datos del formulario al backend (Crear o Actualizar).
   * Maneja la subida de archivos (imágenes) mediante FormData.
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

  /**
   * Elimina la ausencia seleccionada tras confirmación del usuario.
   */
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
