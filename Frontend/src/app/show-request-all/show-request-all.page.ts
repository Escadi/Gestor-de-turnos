import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-request-all',
  templateUrl: './show-request-all.page.html',
  styleUrls: ['./show-request-all.page.scss'],
  standalone: false
})
export class ShowRequestAllPage implements OnInit {
  currentUser: any = null;
  viewMode: string = 'peticiones';

  requests: any[] = [];
  absences: any[] = [];
  requestTypes: any[] = [];

  // New Item Models
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
   * Carga todas las peticiones de todos los trabajadores.
   */
  loadData() {
    if (!this.currentUser || !this.currentUser.idWorker) {
      console.warn('idWorker not found, fetching from localStorage');
      const userStr = localStorage.getItem('user');
      if (userStr) this.currentUser = JSON.parse(userStr);
    }

    if (!this.currentUser) return;

    // Cargar TODAS las peticiones sin filtrar por idWorker
    this.myServices.getRequests(this.currentUser.idWorker, this.currentUser.role, true).subscribe({
      next: (data: any) => {
        this.requests = data;
        console.log('All requests:', this.requests);
      },
      error: (err) => console.error('Error loading requests:', err)
    });

    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.requestTypes = data,
      error: (err) => console.error('Error loading request types:', err)
    });
  }

  getTypeName(idType: number): string {
    const type = this.requestTypes.find(t => t.id === idType);
    return type ? type.typeRequest : 'Petición';
  }

  getWorkerName(request: any): string {
    if (request.worker) {
      return `${request.worker.name} ${request.worker.surname}`;
    }
    return 'Trabajador desconocido';
  }

  getStatusColor(status: string): string {
    status = status?.toLowerCase();
    if (status === 'pendiente') return 'warning';
    if (status === 'aprobada' || status === 'aceptada') return 'success';
    if (status === 'rechazada') return 'danger';
    return 'medium';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.capturedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }
  handleError(err: any, loading: any) {
    loading.dismiss();
    console.error('Error saving item:', err);
  }

  async deleteRequest(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Petición',
      message: '¿Estás seguro de que deseas eliminar esta petición?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Eliminando petición...'
            });
            await loading.present();

            this.myServices.deleteRequest(id).subscribe({
              next: () => {
                loading.dismiss();
                this.loadData();
              },
              error: async (err) => {
                loading.dismiss();
                console.error('Error al eliminar petición:', err);
                const errorAlert = await this.alertCtrl.create({
                  header: 'Error',
                  message: 'No se pudo eliminar la petición. Inténtalo de nuevo.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}


