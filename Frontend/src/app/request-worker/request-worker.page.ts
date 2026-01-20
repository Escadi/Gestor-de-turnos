import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-request-worker',
  templateUrl: './request-worker.page.html',
  styleUrls: ['./request-worker.page.scss'],
  standalone: false
})
export class RequestWorkerPage implements OnInit {

  requests: any[] = [];
  requestTypes: any[] = [];
  currentUser: any = null;

  // Modal control
  isModalOpen: boolean = false;

  newRequest = {
    idType: null,
    details: '',
    status: 'Pendiente'
  };

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

  loadData() {
    if (!this.currentUser) return;

    // Solo cargamos MIS peticiones
    this.myServices.getRequests(this.currentUser.idWorker).subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });

    this.myServices.getRequestTypes().subscribe({
      next: (data: any) => this.requestTypes = data,
      error: (err) => console.error('Error cargando tipos:', err)
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.newRequest = { idType: null, details: '', status: 'Pendiente' };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async submitRequest() {
    if (!this.newRequest.idType) {
      const alert = await this.alertCtrl.create({
        header: 'Campo requerido',
        message: 'Por favor selecciona el tipo de petición.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Enviando...' });
    await loading.present();

    const requestData = {
      idWorker: this.currentUser.idWorker,
      idType: this.newRequest.idType,
      details: this.newRequest.details,
      status: 'Pendiente',
      applicationDate: new Date()
    };

    this.myServices.createRequest(requestData).subscribe({
      next: () => {
        loading.dismiss();
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al crear petición:', err);
      }
    });
  }

  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'Pendiente').length;
  }

  getTypeName(idType: number): string {
    const type = this.requestTypes.find(t => t.id === idType);
    return type ? type.typeRequest : 'Sin tipo';
  }
}
