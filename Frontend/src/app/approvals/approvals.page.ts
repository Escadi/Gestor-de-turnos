import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-approvals',
    templateUrl: './approvals.page.html',
    styleUrls: ['./approvals.page.scss'],
    standalone: false
})
/**----------------------------------------------------------------------------
 * CONTROLADOR: ApprovalsPage
 * GESTIONA EL FLUJO DE APROBACIÓN DE SOLICITUDES Y AUSENCIAS.
 * CARGA SOLO LAS PETICIONES DE LOS TRABAJADORES A CARGO DEL USUARIO LOGUEADO.
 * ----------------------------------------------------------------------------
 */
export class ApprovalsPage implements OnInit {
    currentUser: any = null;
    requests: any[] = [];
    absences: any[] = [];
    requestTypes: any[] = [];

    pendingRequests: any[] = [];
    pendingAbsences: any[] = [];
    recentActivity: any[] = [];

    /**
     * ------------------------------------------------------------------------------------
     * CONTROL DEL MODAL PARA VER DETALLES DE SOLICITUDES Y AUSENCIAS
     * ------------------------------------------------------------------------------------
     */
    isModalOpen: boolean = false;
    selectedItem: any = null;
    modalOrigin: 'request' | 'absence' = 'request';

    constructor(
        private router: Router,
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    /**
     * ------------------------------------------------------------------------------------
     * APERTURA DEL MODAL PARA VER DETALLES DE SOLICITUDES Y AUSENCIAS
     * ------------------------------------------------------------------------------------
     */
    openDetails(item: any, origin: 'request' | 'absence') {
        this.selectedItem = item;
        this.modalOrigin = origin;
        this.isModalOpen = true;
    }

    /**
     * ------------------------------------------------------------------------------------
     * CIERRE DEL MODAL PARA VER DETALLES DE SOLICITUDES Y AUSENCIAS
     * ------------------------------------------------------------------------------------
     */
    closeModal() {
        this.isModalOpen = false;
        this.selectedItem = null;
    }

    /**
     * ------------------------------------------------------------------------------------
     * OBTENCIÓN DE LA URL DEL ARCHIVO ADJUNTO
     * ------------------------------------------------------------------------------------
     */
    getFileUrl(filename: string): string {
        const apiUrl = this.myServices.getApiUrl ? this.myServices.getApiUrl() : 'https://dialectal-maniform-amara.ngrok-free.dev';
        return `${apiUrl}/public/Images/${filename}`;
    }

    /**
     * ------------------------------------------------------------------------------------
     * INICIALIZACIÓN DEL COMPONENTE
     * ------------------------------------------------------------------------------------
     */
    ngOnInit() {
        /**
         * ------------------------------------------------------------------------------------
         * OBTENCIÓN DEL ID Y ROL DEL USUARIO LOGUEADO
         * ------------------------------------------------------------------------------------
         */
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            this.loadData();
        }
    }

    /**
     * ------------------------------------------------------------------------------------
     * NAVEGACIÓN CENTRALIZADA
     * ------------------------------------------------------------------------------------
     */
    goTo(path: string) {
        this.router.navigateByUrl(path);
    }
    getRequests() { this.goTo('tab-user/my-requests'); }
    getAbsences() { this.goTo('tab-user/absences-worker'); }
    getAllRequests() { this.goTo('tab-user/show-request-all'); }


    /**----------------------------------------------------------------------------
     * CARGA LAS SOLICITUDES Y AUSENCIAS DE LOS SUBORDINADOS.
     * FILTRA LAS PENDIENTES PARA MOSTRARLAS EN LA CABECERA.
     * ----------------------------------------------------------------------------
     */
    loadData() {
        if (!this.currentUser) return;

        /**
         * ------------------------------------------------------------------------------------
         * CARGA DE SOLICITUDES DE PETICIONESDE LOS SUBORDINADOS
         * ------------------------------------------------------------------------------------
         */
        this.myServices.getRequests(this.currentUser.idWorker, this.currentUser.role, true).subscribe({
            next: (data: any) => {
                this.requests = data;
                this.pendingRequests = data.filter((r: any) => r.status === 'Pendiente');
                this.updateRecentActivity();
            },
            error: (err) => console.error('Error loading requests:', err)
        });

        /**
         * ------------------------------------------------------------------------------------
         * CARGA DE SOLICITUDES DE AUSENCIAS DE LOS SUBORDINADOS
         * ------------------------------------------------------------------------------------
         */
        this.myServices.getAbences(this.currentUser.idWorker, this.currentUser.role, true).subscribe({
            next: (data: any) => {
                this.absences = data;
                this.pendingAbsences = data.filter((a: any) => a.status === 'Pendiente');
                this.updateRecentActivity();
            },
            error: (err) => console.error('Error loading absences:', err)
        });

        /**
         * ------------------------------------------------------------------------------------
         * CARGA DE TIPOS DE SOLICITUDES
         * ------------------------------------------------------------------------------------
         */
        this.myServices.getRequestTypes().subscribe({
            next: (data: any) => this.requestTypes = data,
            error: (err) => console.error('Error loading request types:', err)
        });
    }

    /**
     * ------------------------------------------------------------------------------------
     * ACTUALIZACIÓN DE LA ACTIVIDAD RECIENTE QUE ESTA EN LA PARTE
     * BAJA DEL HTML CON LOS DATOS DE CADA TRABAJADOR
     * ------------------------------------------------------------------------------------
     */
    updateRecentActivity() {
        /**
         * ------------------------------------------------------------------------------------
         * COMBINA Y ORDENA POR FECHA
         * ------------------------------------------------------------------------------------
         */
        const all = [
            ...this.requests.map(r => ({ ...r, origin: 'request', date: r.applicationDate })),
            ...this.absences.map(a => ({ ...a, origin: 'absence', date: a.applicationDate }))
        ];

        /**
         * ------------------------------------------------------------------------------------
         * ORDENA DESCENDENTEMENTE
         * ------------------------------------------------------------------------------------
         */
        this.recentActivity = all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    }

    /**
     * ------------------------------------------------------------------------------------
     * OBTENCIÓN DEL NOMBRE DEL TIPO DE SOLICITUD
     * ------------------------------------------------------------------------------------
     */
    getTypeName(idType: number): string {
        const type = this.requestTypes.find(t => t.id === idType);
        return type ? type.typeRequest : 'Petición';
    }

    /**
     * ------------------------------------------------------------------------------------
     * APROBACIÓN DE SOLICITUDES
     * ------------------------------------------------------------------------------------
     */
    async approveRequest(request: any) {
        this.updateStatus(request, 'Aprobada', 'request');
    }

    /**
     * ------------------------------------------------------------------------------------
     * RECHAZO DE SOLICITUDES
     * ------------------------------------------------------------------------------------
     */
    async rejectRequest(request: any) {
        this.updateStatus(request, 'Rechazada', 'request');
    }

    /**
     * ------------------------------------------------------------------------------------
     * APROBACIÓN DE AUSENCIAS
     * ------------------------------------------------------------------------------------
     */
    async approveAbsence(absence: any) {
        this.updateStatus(absence, 'Aprobada', 'absence');
    }

    /**
     * ------------------------------------------------------------------------------------
     * RECHAZO DE AUSENCIAS
     * ------------------------------------------------------------------------------------
     */
    async rejectAbsence(absence: any) {
        this.updateStatus(absence, 'Rechazada', 'absence');
    }

    /**
     * ------------------------------------------------------------------------------------
     * ACTUALIZA EL ESTADO DE UNA SOLICITUD O AUSENCIA (APROBADA/RECHAZADA).
     * @param item OBJETO SOLICITUD/AUSENCIA
     * @param status NUEVO ESTADO
     * @param origin TIPO DE OBJETO ('REQUEST' | 'ABSENCE')
     * ------------------------------------------------------------------------------------
     */
    async updateStatus(item: any, status: string, origin: string) {
        const loading = await this.loadingCtrl.create({ message: 'Procesando...' });
        await loading.present();

        const updateData = { ...item, status: status };
        /**
         * ------------------------------------------------------------------------------------
         * ELIMINA LOS OBJETOS ANIDADOS COMPLEJOS ANTES DE ENVIARLOS DE VUELTA 
         * A LA API SI ES NECESARIO, AUNQUE NORMALMENTE LOS PUNTOS FINALES DE 
         * ACTUALIZACIÓN SOLO TOMAN LOS CAMPOS MODIFICADOS.
         * ------------------------------------------------------------------------------------
         */
        delete updateData.worker;
        delete updateData.origin;
        delete updateData.date;

        const isAbsence = origin === 'absence';
        let payload: any = updateData;

        if (isAbsence) {
            const formData = new FormData();
            formData.append('typeAbences', item.typeAbences);
            formData.append('timeStart', item.timeStart);
            formData.append('timeEnd', item.timeEnd);
            formData.append('details', item.details || '');
            formData.append('status', status);
            payload = formData;
        }

        const obs = origin === 'request'
            ? this.myServices.updateRequest(item.id, payload)
            : this.myServices.updateAbence(item.id, payload);

        obs.subscribe({
            next: () => {
                loading.dismiss();
                this.loadData();
            },
            error: (err) => {
                loading.dismiss();
                console.error('Error updating status:', err);
            }
        });
    }
}
