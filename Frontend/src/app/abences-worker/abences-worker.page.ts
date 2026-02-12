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
 * ----------------------------------------------------------------------------------------------------------------
 * CONTROLADOR: AbencesWorkerPage
 * GESTIONA LA VISUALIZACIÓN Y OPERACIONES CRUD DE LAS AUSENCIAS.
 * SOPORTA ROLES PARA MOSTRAR SOLO LAS PROPIAS O LAS DE SUBORDINADOS.
 * ----------------------------------------------------------------------------------------------------------------
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
   * ----------------------------------------------------------------------------------------------------------------
   * CICLO DE VIDA: INICIALIZACIÓN DEL COMPONENTE.
   * CARGA EL USUARIO ACTUAL Y SOLICITA LOS DATOS INICIALES.
   * ----------------------------------------------------------------------------------------------------------------
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
   * ----------------------------------------------------------------------------------------------------------------
   * DEVUELVE LA CLASE CSS CORRESPONDIENTE AL ESTADO DE LA SOLICITUD.
   * ESTADO DE LA AUSENCIA (PENDIENTE, APROBADA, RECHAZADA)
   * ----------------------------------------------------------------------------------------------------------------
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
   * ----------------------------------------------------------------------------------------------------------------
   * CARGA LA LISTA DE AUSENCIAS DESDE EL BACKEND.
   * APLICA FILTROS SEGÚN EL ROL DEL USUARIO (ADMIN VE TODAS, EMPLEADO SOLO SUYAS).
   * ----------------------------------------------------------------------------------------------------------------
   */
  loadData() {
    if (!this.currentUser) {
      console.error('currentUser is null, cannot load absences');
      return;
    }
    console.log('currentUser:', this.currentUser);
    /**
     * ----------------------------------------------------------------------------------------------
     * DETERMINAR SI EL USUARIO PUEDE VER TODAS LAS PETICIONES SEGÚN SU ROL
     * ----------------------------------------------------------------------------------------------
     */
    const canViewAll = this.canViewAll;

    console.log('canViewAll:', canViewAll, '| role:', this.currentUser.role);

    /**
     * ----------------------------------------------------------------------------------------------
     * SI PUEDE VER TODAS, NO PASAMOS IDWORKER; SI ES TRABAJADOR, PASAMOS SU IDWORKER
     * ----------------------------------------------------------------------------------------------
     */
    const idWorker = canViewAll ? undefined : this.currentUser.idWorker;

    /**
     * ----------------------------------------------------------------------------------------------
     * SIEMPRE PASAMOS EL ROL PARA QUE EL BACKEND PUEDA VALIDAR
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
  * CONTADOR DE PETICIONES PENDIENTES
  * ----------------------------------------------------------------------------------------------
  */
  get pendingCount(): number {
    return this.abences.filter(r => r.status === 'Pendiente').length;
  }
  /**
   * ----------------------------------------------------------------------------------------------
   * DETERMINAR SI EL USUARIO PUEDE VER TODAS LAS PETICIONES
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
   * OBTENER NOMBRE DEL TRABAJADOR
   * ----------------------------------------------------------------------------------------------
   */
  /**
   * ----------------------------------------------------------------------------------------------
   * OBTIENE LA LISTA COMPLETA DE TRABAJADORES PARA MOSTRAR NOMBRES EN LAS TARJETAS.
   * ----------------------------------------------------------------------------------------------
   */
  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.worker = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * HELPER PARA OBTENER EL NOMBRE COMPLETO DE UN TRABAJADOR ASOCIADO A UNA SOLICITUD.
   * ----------------------------------------------------------------------------------------------
   */
  getWorkerName(request: any): string {
    if (request.worker) {
      return `${request.worker.name} ${request.worker.surname}`;
    }
    return 'Trabajador desconocido';
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * FUNCIONES DEL MODAL
   * ----------------------------------------------------------------------------------------------
   */
  /**
   * ----------------------------------------------------------------------------------------------
   * ABRE EL MODAL PARA CREAR UNA NUEVA AUSENCIA.
   * REINICIA EL FORMULARIO.
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

  /**
   * ----------------------------------------------------------------------------------------------
   * ABRE EL MODAL PARA EDITAR UNA AUSENCIA EXISTENTE.
   * CARGA LOS DATOS DE LA AUSENCIA SELECCIONADA EN EL FORMULARIO.
   * ----------------------------------------------------------------------------------------------
   */
  openEditModal(abence: any) {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.selectedAbence = abence;

    /**
     * ----------------------------------------------------------------------------------------------
     * FIX PARA EL ERROR "INVALID TIME": ASEGURA QUE LAS CADENAS DE FECHA TENGAN EL SEPARADOR 'T'.
     * ----------------------------------------------------------------------------------------------
     */
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
    /**
     * ----------------------------------------------------------------------------------------------
     * CARGA LA IMAGEN PREVIA SI EXISTE.
     * ----------------------------------------------------------------------------------------------
     */
    if (abence.filename) {
      this.imagePreview = `${this.myServices.baseUrl}/public/Images/${abence.filename}`;
    } else {
      this.imagePreview = null;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * CIERRA EL MODAL Y LIMPIA LAS VARIABLES TEMPORALES.
   * ----------------------------------------------------------------------------------------------
   */
  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedAbence = null;
    this.imagePreview = null;
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * MANEJO DE IMÁGENES
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

  /**
   * ----------------------------------------------------------------------------------------------
   * ELIMINA LA IMAGEN SELECCIONADA.
   * ----------------------------------------------------------------------------------------------
   */
  removeImage() {
    this.newAbence.capturedImage = null;
    this.imagePreview = null;
  }

  /**
   * ----------------------------------------------------------------------------------------------
   * OPERACIONES CRUD
   * ----------------------------------------------------------------------------------------------
   */
  /**
   * ----------------------------------------------------------------------------------------------
   * ENVÍA LOS DATOS DEL FORMULARIO AL BACKEND (CREAR O ACTUALIZAR).
   * MANEJA LA SUBIDA DE ARCHIVOS (IMÁGENES) MEDIANTE FORMDATA.
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

  /**
   * ----------------------------------------------------------------------------------------------
   * ELIMINA LA AUSENCIA SELECCIONADA TRAS CONFIRMACIÓN DEL USUARIO.
   * ----------------------------------------------------------------------------------------------
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

  /**
   * ----------------------------------------------------------------------------------------------
   * CIERRA LA SESIÓN DEL USUARIO.
   * ----------------------------------------------------------------------------------------------
   */
  logout() {
    this.myServices.logout();
  }
}
