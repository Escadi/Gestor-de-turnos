import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  loginData = {
    idWorker: '',
    password: ''
  };

  constructor(
    private router: Router,
    private myServices: MyServices,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ionViewWillEnter() {
    // Limpiamos los campos al entrar en la pantalla de login (post-logout)
    this.resetForm();
  }

  async openUserTab() {
    if (!this.loginData.idWorker || !this.loginData.password) {
      this.showAlert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    // Limpiar localStorage antes de intentar login para evitar sesiones antiguas
    localStorage.removeItem('user');

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 5000
    });
    await loading.present();

    this.myServices.login(this.loginData).subscribe({
      next: (res: any) => {
        loading.dismiss();

        // Guardamos los datos del usuario logueado
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('role', res.role);


        // Redirigimos según el rol
        // Redirigimos según el rol (AHORA INCLUSIVO)
        // Todos los usuarios autenticados van al layout principal con pestañas
        this.router.navigateByUrl('/tab-user').then(() => {
          this.resetForm();
        });

      },
      error: (err) => {
        loading.dismiss();
        console.error('Error de login completo:', err);
        console.error('Error response:', err.error);
        console.error('Status:', err.status);

        const message = err.error?.message || 'Error al conectar con el servidor.';
        this.showAlert('Error de Login', message);
      }
    });
  }

  resetForm() {
    this.loginData = {
      idWorker: '',
      password: ''
    };
  }



  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }


  //FUNCIÓN PARA BUSCAR LA FUNCION DEL USUARIO LOGUEADO


  //FUNCIÓN PARA BUSCAR EL ROL DEL USUARIO LOGUEADO

}
