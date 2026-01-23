import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { MyServices } from 'src/app/services/my-services';

@Component({
  selector: 'app-manage-departament',
  templateUrl: './manage-departament.page.html',
  styleUrls: ['./manage-departament.page.scss'],
  standalone: false
})
export class ManageDepartamentPage implements OnInit {

  departament: any[] = [];

  // Modal control
  isModalOpen: boolean = false;
  editingId: number | null = null;

  categoryData = {};



  constructor(
    private myServices: MyServices,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.myServices.getDepartments().subscribe((res: any) => {
      this.departament = res.map((dpto: any) => ({
        ...dpto,
        name: dpto.name || dpto.name
      }));
    });
  }

  openAddModal() {
    this.resetForm();
    this.isModalOpen = true;
  }

  resetForm() {
    this.categoryData = {
      name: ''
    };
    this.editingId = null;
  }

  async saveCategory() {
    if (!this.categoryData) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    if (this.editingId) {
      this.myServices.updateDepartment(this.editingId, this.categoryData).subscribe({
        next: () => {
          loading.dismiss();
          this.isModalOpen = false;
          this.loadData();
        },
        error: () => loading.dismiss()
      });
    } else {
      this.myServices.createDepartment(this.categoryData).subscribe({
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
      header: '¿Eliminar departamento?',
      message: 'Esta acción podría afectar a los trabajadores vinculados.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          cssClass: 'delete-button',
          handler: () => {
            this.myServices.deleteDepartment(id).subscribe(() => this.loadData());
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
