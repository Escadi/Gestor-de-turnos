import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-workers-details-crud',
  templateUrl: './workers-details-crud.page.html',
  styleUrls: ['./workers-details-crud.page.scss'],
  standalone: false,
})
export class WorkersDetailsCrudPage implements OnInit {

  worker: any = {};
  nameFunctions: any[] = [];
  originalWorker: any = {};

  constructor(
    private router: Router,
    private myServices: MyServices,
    private alertController: AlertController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.worker = { ...navigation.extras.state['worker'] };
      this.originalWorker = { ...navigation.extras.state['worker'] };
    }
  }

  ngOnInit() {
    this.loadNameFunctions();
  }

  loadNameFunctions() {
    this.myServices.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      },
      error: (err) => console.error('Error cargando funciones:', err)
    });
  }

  cancelar() {
    this.router.navigate(['/my-workers']);
  }

  async guardarCambios() {
    // Validar que los campos requeridos estén completos
    if (!this.worker.name || !this.worker.surname || !this.worker.dni) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa los campos obligatorios (Nombre, Apellido, DNI)',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.myServices.updateWorker(this.worker.id, this.worker).subscribe({
      next: async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Trabajador actualizado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/my-workers']);
      },
      error: async (err) => {
        console.error('Error actualizando trabajador:', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar el trabajador. Intenta de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  async eliminarTrabajador() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${this.worker.name} ${this.worker.surname}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion();
          }
        }
      ]
    });
    await alert.present();
  }

  confirmarEliminacion() {
    this.myServices.deleteWorker(this.worker.id).subscribe({
      next: async (response) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Trabajador eliminado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/my-workers']);
      },
      error: async (err) => {
        console.error('Error eliminando trabajador:', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo eliminar el trabajador. Intenta de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  obtenerNombreFuncion(idFuncion: number): string {
    const func = this.nameFunctions.find((f: any) => f.id === idFuncion);
    if (!func) return 'Sin función';
    return func.nameCategory;
  }

}
