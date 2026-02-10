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
 * Gestiona el flujo de aprobación de solicitudes y ausencias.
 * Carga solo las peticiones de los trabajadores a cargo del usuario logueado.
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

    // Modal Control
    isModalOpen: boolean = false;
    selectedItem: any = null;
    modalOrigin: 'request' | 'absence' = 'request';

    constructor(
        private router: Router,
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    openDetails(item: any, origin: 'request' | 'absence') {
        this.selectedItem = item;
        this.modalOrigin = origin;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedItem = null;
    }

    getFileUrl(filename: string): string {
        const apiUrl = this.myServices.getApiUrl ? this.myServices.getApiUrl() : 'https://dialectal-maniform-amara.ngrok-free.dev';
        return `${apiUrl}/public/Images/${filename}`;
    }

    ngOnInit() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            this.loadData();
        }
    }

    /**----------------------------------------------------------------------------
     * Navegación centralizada.
     * @param path Ruta destino
     * ----------------------------------------------------------------------------
     */
    goTo(path: string) {
        this.router.navigateByUrl(path);
    }
    getRequests() { this.goTo('tab-user/my-requests'); }
    getAbsences() { this.goTo('tab-user/absences-worker'); }


    /**----------------------------------------------------------------------------
     * Carga las solicitudes y ausencias de los subordinados.
     * Filtra las pendientes para mostrarlas en la cabecera.
     * ----------------------------------------------------------------------------
     */
    loadData() {
        if (!this.currentUser) return;

        // Load normal requests for subordinates
        this.myServices.getRequests(this.currentUser.idWorker, this.currentUser.role, true).subscribe({
            next: (data: any) => {
                this.requests = data;
                this.pendingRequests = data.filter((r: any) => r.status === 'Pendiente');
                this.updateRecentActivity();
            },
            error: (err) => console.error('Error loading requests:', err)
        });

        // Load absences for subordinates
        this.myServices.getAbences(this.currentUser.idWorker, this.currentUser.role, true).subscribe({
            next: (data: any) => {
                this.absences = data;
                this.pendingAbsences = data.filter((a: any) => a.status === 'Pendiente');
                this.updateRecentActivity();
            },
            error: (err) => console.error('Error loading absences:', err)
        });

        // Load request types for names
        this.myServices.getRequestTypes().subscribe({
            next: (data: any) => this.requestTypes = data,
            error: (err) => console.error('Error loading request types:', err)
        });
    }

    updateRecentActivity() {
        // Combine and sort by date
        const all = [
            ...this.requests.map(r => ({ ...r, origin: 'request', date: r.applicationDate })),
            ...this.absences.map(a => ({ ...a, origin: 'absence', date: a.applicationDate }))
        ];

        // Sort descending
        this.recentActivity = all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    }

    getTypeName(idType: number): string {
        const type = this.requestTypes.find(t => t.id === idType);
        return type ? type.typeRequest : 'Petición';
    }

    async approveRequest(request: any) {
        this.updateStatus(request, 'Aprobada', 'request');
    }

    async rejectRequest(request: any) {
        this.updateStatus(request, 'Rechazada', 'request');
    }

    async approveAbsence(absence: any) {
        this.updateStatus(absence, 'Aprobada', 'absence');
    }

    async rejectAbsence(absence: any) {
        this.updateStatus(absence, 'Rechazada', 'absence');
    }

    /**
     * Actualiza el estado de una solicitud o ausencia (Aprobada/Rechazada).
     * @param item Objeto solicitud/ausencia
     * @param status Nuevo estado
     * @param origin Tipo de objeto ('request' | 'absence')
     */
    async updateStatus(item: any, status: string, origin: string) {
        const loading = await this.loadingCtrl.create({ message: 'Procesando...' });
        await loading.present();

        const updateData = { ...item, status: status };
        // Remove complex nested objects before sending back to API if needed, 
        // though usually update endpoints just take the changed fields.
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
