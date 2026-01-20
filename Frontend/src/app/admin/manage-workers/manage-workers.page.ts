import { Component, OnInit } from '@angular/core';
import { MyServices } from '../../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-manage-workers',
    templateUrl: './manage-workers.page.html',
    styleUrls: ['./manage-workers.page.scss'],
    standalone: false
})
export class ManageWorkersPage implements OnInit {

    workers: any[] = [];
    categories: any[] = [];

    // Control del Modal (Panel)
    isModalOpen: boolean = false;
    editingId: number | null = null;

    workerData = {
        name: '',
        surname: '',
        dni: '',
        idFuction: null,
        password: '',
        role: 'user'
    };

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.myServices.getWorkers().subscribe((res: any) => {
            this.workers = res;
        });
        this.myServices.getNameFunctions().subscribe((res: any) => {
            this.categories = res;
        });
    }

    openAddModal() {
        this.resetForm();
        this.isModalOpen = true;
    }

    resetForm() {
        this.workerData = {
            name: '',
            surname: '',
            dni: '',
            idFuction: null,
            password: '',
            role: 'user'
        };
        this.editingId = null;
    }

    async saveWorker() {
        if (!this.workerData.name || !this.workerData.dni) {
            const alert = await this.alertCtrl.create({
                header: 'Faltan datos',
                message: 'Nombre y DNI son obligatorios.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
        await loading.present();

        if (this.editingId) {
            this.myServices.updateWorker(this.editingId, this.workerData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: () => loading.dismiss()
            });
        } else {
            this.myServices.createWorker(this.workerData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: () => loading.dismiss()
            });
        }
    }

    editWorker(worker: any) {
        this.editingId = worker.id;
        this.workerData = {
            name: worker.name,
            surname: worker.surname || '',
            dni: worker.dni,
            idFuction: worker.idFuction,
            password: '',
            role: 'user'
        };
        this.isModalOpen = true;
    }

    async deleteWorker(id: number) {
        const alert = await this.alertCtrl.create({
            header: '¿Eliminar trabajador?',
            message: 'Esta acción es permanente y borrará sus fichajes.',
            cssClass: 'custom-alert',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    cssClass: 'delete-button',
                    handler: () => {
                        this.myServices.deleteWorker(id).subscribe(() => {
                            this.loadData();
                            this.isModalOpen = false;
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    closeModal() {
        this.isModalOpen = false;
    }

}
