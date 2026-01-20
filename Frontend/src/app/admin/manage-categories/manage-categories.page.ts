import { Component, OnInit } from '@angular/core';
import { MyServices } from '../../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-manage-categories',
    templateUrl: './manage-categories.page.html',
    styleUrls: ['./manage-categories.page.scss'],
    standalone: false
})
export class ManageCategoriesPage implements OnInit {

    categories: any[] = [];

    // Modal control
    isModalOpen: boolean = false;
    editingId: number | null = null;

    categoryData = {
        name: '',
        accessLevel: 'Empleado'
    };

    accessLevels = ['Admin', 'Dirección', 'Jefe de Administración', 'Supervisor', 'Empleado'];

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.myServices.getNameFunctions().subscribe((res: any) => {
            this.categories = res.map((cat: any) => ({
                ...cat,
                name: cat.name || cat.nameCategory
            }));
        });
    }

    openAddModal() {
        this.resetForm();
        this.isModalOpen = true;
    }

    resetForm() {
        this.categoryData = {
            name: '',
            accessLevel: 'Empleado'
        };
        this.editingId = null;
    }

    async saveCategory() {
        if (!this.categoryData.name) return;

        const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
        await loading.present();

        if (this.editingId) {
            this.myServices.updateCategory(this.editingId, this.categoryData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: () => loading.dismiss()
            });
        } else {
            this.myServices.createCategory(this.categoryData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: () => loading.dismiss()
            });
        }
    }

    editCategory(category: any) {
        this.editingId = category.id;
        this.categoryData = {
            name: category.name,
            accessLevel: category.accessLevel || 'Empleado'
        };
        this.isModalOpen = true;
    }

    async deleteCategory(id: number) {
        const alert = await this.alertCtrl.create({
            header: '¿Eliminar categoría?',
            message: 'Esta acción podría afectar a los trabajadores vinculados.',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    cssClass: 'delete-button',
                    handler: () => {
                        this.myServices.deleteCategory(id).subscribe(() => this.loadData());
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
