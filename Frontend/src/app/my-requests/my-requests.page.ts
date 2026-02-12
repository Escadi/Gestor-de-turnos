import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.page.html',
    styleUrls: ['./my-requests.page.scss'],
    standalone: false
})
/**
 * ------------------------------------------------------------------------------------------
 * CONTROLADOR: MyRequestsPage
 * PERMITE A CUALQUIER USUARIO CREAR, VER Y ELIMINAR SUS PROPIAS SOLICITUDES.
 * MANEJA TANTO PETICIONES FORMALES COMO NOTIFICACIONES DE AUSENCIA/BAJA.
 * ------------------------------------------------------------------------------------------
 */
export class MyRequestsPage implements OnInit {
    currentUser: any = null;
    viewMode: string = 'peticiones';

    requests: any[] = [];
    absences: any[] = [];
    requestTypes: any[] = [];

    /* ------------------------------------------------------------------------------------------
     * CONTROL DEL MODAL
     * ------------------------------------------------------------------------------------------
     */
    isModalOpen: boolean = false;
    modalType: 'peticion' | 'ausencia' = 'peticion';
    isEditMode: boolean = false;
    selectedItem: any = null;
    showPetitionDates: boolean = false;

    /* 
     * ------------------------------------------------------------------------------------------
     * MODELOS PARA NUEVOS ELEMENTOS
     * ------------------------------------------------------------------------------------------
     */
    formData = {
        idType: '',
        typeAbences: '',
        timeStart: new Date().toISOString(),
        timeEnd: new Date().toISOString(),
        details: '',
        capturedImage: null as File | null
    };
    imagePreview: string | null = null;

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        /**
         * ----------------------------------------------------------------------------------------------------------------
         * CARGA LOS DATOS DEL USUARIO LOGUEADO EN EL LOCALSTORAGE CARGANDO SU ID Y ROL DESDE UN PRINCIPIO.
         * ----------------------------------------------------------------------------------------------------------------
         */
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            this.loadData();
        }
    }

    ionViewWillEnter() {
        this.loadData();
    }

    /**
     * ------------------------------------------------------------------------------------------
     * CARGA EL HISTORIAL PERSONAL DEL USUARIO.
     * SOLICITA AL SERVICIO LAS PETICIONES FILTRANDO POR 'SUBORDINATES=FALSE' (SOLO PROPIAS).
     * ------------------------------------------------------------------------------------------
     */

    loadData() {
        if (!this.currentUser || !this.currentUser.idWorker) {
            console.warn('idWorker not found, fetching from localStorage');
            const userStr = localStorage.getItem('user');
            if (userStr) this.currentUser = JSON.parse(userStr);
        }

        if (!this.currentUser || !this.currentUser.idWorker) return;

        /**
         * ------------------------------------------------------------------------------------------------------
         * GET DE TODOS LOS DATOS TANTO DE PETICIONES COMO DE AUSENCIAS PARA LA VISUALIZACION
         * DE LOS DATOS
         * 
         * (this.currentUser.idWorker, this.currentUser.role, false) -> 
         * SE VISUALIZA EN EL HISTORIAL PERSONAL (INDIVIDUAL)
         * 
         * (this.currentUser.idWorker, this.currentUser.role, true) -> 
         * SE VISUALIZA EL HISTORIAL DE TODOS LOS TRABAJADORES (SUPERVISOR)
         * 
         * --------------------------------------------------------------------------------------------------------------------------------
         */

        this.myServices.getRequests(this.currentUser.idWorker, this.currentUser.role, false).subscribe({
            next: (data: any) => this.requests = data,
            error: (err) => console.error('Error loading requests:', err)
        });

        this.myServices.getAbences(this.currentUser.idWorker, this.currentUser.role, false).subscribe({
            next: (data: any) => this.absences = data,
            error: (err) => console.error('Error loading absences:', err)
        });

        this.myServices.getRequestTypes().subscribe({
            next: (data: any) => this.requestTypes = data,
            error: (err) => console.error('Error loading request types:', err)
        });
    }
    /**
     * ------------------------------------------------------------------------------------------------------
     * GET DE TODOS LOS TIPOS DE PETICIONES
     * ------------------------------------------------------------------------------------------------------
     */
    getTypeName(idType: number): string {
        const type = this.requestTypes.find(t => t.id === idType);
        return type ? type.typeRequest : 'Petición';
    }
    /**
     * ------------------------------------------------------------------------------------------------------
     * GET DE TODOS LOS DATOS DE LOS ESTADOS DE LAS PETICIONES (COLORES PARA EL FRONTEND)
     * -------------------------------------------------------------------------------------------------------
     */
    getStatusColor(status: string): string {
        status = status?.toLowerCase();
        if (status === 'pendiente') return 'warning';
        if (status === 'aprobada' || status === 'aceptada') return 'success';
        if (status === 'rechazada') return 'danger';
        return 'medium';
    }

    /*
     ------------------------------------------------------------------------------------------
     LÓGICA DEL MODAL PARA LA CREACIÓN DE PETICIONES Y AUSENCIAS
     ------------------------------------------------------------------------------------------
    */
    openAddModal(type: 'peticion' | 'ausencia') {
        this.modalType = type;
        this.isEditMode = false;
        this.isModalOpen = true;
        this.showPetitionDates = false;
        this.resetForm();
    }
    /**
     * ------------------------------------------------------------------------------------------------------
     * RESET DEL FORMULARIO Y VARIABLES DEL MODAL PARA AÑADIR LOS DATOS A LA TABLA DE LA ->DB<-
     * ------------------------------------------------------------------------------------------------------
     */
    resetForm() {
        this.formData = {
            idType: '',
            typeAbences: '',
            timeStart: new Date().toISOString(),
            timeEnd: new Date().toISOString(),
            details: '',
            capturedImage: null
        };
        this.imagePreview = null;
    }
    /**
     * ------------------------------------------------------------------------------------------------------
     * CIERRE DEL MODAL
     * ------------------------------------------------------------------------------------------------------
     */
    closeModal() {
        this.isModalOpen = false;
    }
    /**
     * ------------------------------------------------------------------------------------------------------
     * SELECCIÓN DE ARCHIVO PARA LA PETICIÓN O AUSENCIA
     * ------------------------------------------------------------------------------------------------------
     */
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.formData.capturedImage = file;
            const reader = new FileReader();
            reader.onload = (e: any) => this.imagePreview = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------
     * GUARDA LA NUEVA SOLICITUD O AUSENCIA.
     * DIFERENCIA LA LÓGICA SEGÚN EL TIPO DE MODAL ACTIVO (JSON PARA PETICIÓN, FORMDATA PARA AUSENCIA CON ARCHIVO).
     * ----------------------------------------------------------------------------------------------------------------
     */
    async saveItem() {
        const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
        await loading.present();

        if (this.modalType === 'peticion') {
            const payload: any = {
                idWorker: this.currentUser.idWorker,
                idType: this.formData.idType,
                details: this.formData.details,
                status: 'Pendiente',
                applicationDate: new Date()
            };

            if (this.showPetitionDates) {
                payload.timeStart = this.formData.timeStart;
                payload.timeEnd = this.formData.timeEnd;
            }
            this.myServices.createRequest(payload).subscribe({
                next: () => this.finishOperation(loading),
                error: (err) => this.handleError(err, loading)
            });
        } else {
            const fd = new FormData();
            fd.append('idWorker', this.currentUser.idWorker);
            fd.append('typeAbences', this.formData.typeAbences);
            fd.append('timeStart', this.formData.timeStart);
            fd.append('timeEnd', this.formData.timeEnd);
            fd.append('details', this.formData.details);
            fd.append('status', 'Pendiente');
            fd.append('applicationDate', new Date().toISOString());
            if (this.formData.capturedImage) fd.append('file', this.formData.capturedImage);

            this.myServices.createAbence(fd).subscribe({
                next: () => this.finishOperation(loading),
                error: (err) => this.handleError(err, loading)
            });
        }
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------
     * FINALIZA LA OPERACIÓN DE GUARDADO.
     * CIERRA EL MODAL Y RECARGA LOS DATOS.
     * ----------------------------------------------------------------------------------------------------------------
     */
    finishOperation(loading: any) {
        loading.dismiss();
        this.closeModal();
        this.loadData();
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------
     * MANEJA LOS ERRORES QUE PUEDAN SURGIR DURANTE LA OPERACIÓN DE GUARDADO.
     * ----------------------------------------------------------------------------------------------------------------
     */
    handleError(err: any, loading: any) {
        loading.dismiss();
        console.error('Error saving item:', err);
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------
     * ELIMINA UNA PETICIÓN DESDE EL MISMO MODAL.
     * ----------------------------------------------------------------------------------------------------------------
     */
    async deleteRequest(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Eliminar Petición',
            message: '¿Estás seguro?',
            buttons: [
                { text: 'No' },
                {
                    text: 'Sí', handler: () => {
                        this.myServices.deleteRequest(id).subscribe(() => this.loadData());
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------
     * ELIMINA UNA AUSENCIA DESDE EL MISMO MODAL.
     * ----------------------------------------------------------------------------------------------------------------
     */
    async deleteAbsence(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Eliminar Ausencia',
            message: '¿Estás seguro?',
            buttons: [
                { text: 'No' },
                {
                    text: 'Sí', handler: () => {
                        this.myServices.deleteAbence(id).subscribe(() => this.loadData());
                    }
                }
            ]
        });
        await alert.present();
    }
}
