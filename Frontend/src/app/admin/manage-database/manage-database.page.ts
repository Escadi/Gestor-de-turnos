import { Component, OnInit } from '@angular/core';
import { MyServices } from '../../services/my-services';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-manage-database',
    templateUrl: './manage-database.page.html',
    styleUrls: ['./manage-database.page.scss'],
    standalone: false
})
export class ManageDatabasePage implements OnInit {

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
    }

    async downloadBackup() {
        const loading = await this.loadingCtrl.create({
            message: 'Generando copia de seguridad para descargar...',
        });
        await loading.present();

        this.myServices.downloadBackup().subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup_timebeep_${new Date().toISOString().split('T')[0]}.sql`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                loading.dismiss();
                this.showToast('Copia de seguridad descargada con éxito');
            },
            error: (err) => {
                console.error(err);
                loading.dismiss();
                this.showToast('Error al descargar la copia de seguridad', 'danger');
            }
        });
    }

    async saveLocalBackup() {
        const loading = await this.loadingCtrl.create({
            message: 'Guardando copia de seguridad en el servidor...',
        });
        await loading.present();

        this.myServices.saveBackupLocal().subscribe({
            next: (res: any) => {
                loading.dismiss();
                this.showToast('Copia de seguridad guardada en la carpeta Database');
            },
            error: (err) => {
                console.error(err);
                loading.dismiss();
                this.showToast('Error al guardar la copia local', 'danger');
            }
        });
    }

    async showToast(message: string, color: string = 'success') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color
        });
        await toast.present();
    }
}
