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
/**
 * CONTROLADOR: HomePage
 * Gestiona el inicio de sesión de los usuarios.
 * Comunica con el backend para validar credenciales y redirige según el rol.
 */
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

  /**
   * Ciclo de vida: Se ejecuta cada vez que la vista va a entrar.
   * Limpia el formulario para asegurar que no queden datos de sesiones anteriores.
   */
  ionViewWillEnter() {
    // Limpiamos los campos al entrar en la pantalla de login (post-logout)
    this.resetForm();
  }

  /**
   * Maneja el proceso de inicio de sesión.
   * 1. Valida campos vacíos.
   * 2. Llama al servicio de login (MyServices).
   * 3. Guarda el token/usuario en localStorage.
   * 4. Redirige a la página principal 'tab-user'.
   */
  async openUserTab() {
    if (!this.loginData.idWorker || !this.loginData.password) {
      this.showAlert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    // Limpiar localStorage antes de intentar login para evitar sesiones antiguas
    localStorage.clear();

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

  /**
   * Reinicia los campos del formulario de login.
   */
  resetForm() {
    this.loginData = {
      idWorker: '',
      password: ''
    };
  }



  /**
   * Muestra una alerta nativa de Ionic con un mensaje.
   * @param header Título de la alerta
   * @param message Cuerpo del mensaje
   */
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
