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
    private alertCtrl: AlertController
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
   * Carga el historial personal del usuario.
   * Solicita al servicio las peticiones filtrando por 'subordinates=false' (solo propias).
   */
  loadData() {
    if (!this.currentUser || !this.currentUser.idWorker) {
      console.warn('idWorker not found, fetching from localStorage');
      const userStr = localStorage.getItem('user');
      if (userStr) this.currentUser = JSON.parse(userStr);
    }

    if (!this.currentUser || !this.currentUser.idWorker) return;

    // subordinates = false to get ONLY PERSONAL records
    this.myServices.getRequests(this.currentUser.idWorker, this.currentUser.role, false).subscribe({
      next: (data: any) => this.requests = data,
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
}


