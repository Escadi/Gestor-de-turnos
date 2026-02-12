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
 * --------------------------------------------------------------------------------------------
 * CONTROLADOR: HomePage
 * GESTIONA EL INICIO DE SESIÓN DE LOS USUARIOS.
 * COMUNICA CON EL BACKEND PARA VALIDAR CREDENCIALES Y REDIRIGE SEGÚN EL ROL.
 * --------------------------------------------------------------------------------------------
 */
export class HomePage {

  /**
   * --------------------------------------------------------------------------------------------
   * BODY PARA EL INICIO DE SESIÓN
   * --------------------------------------------------------------------------------------------
   */
  loginData = {
    idWorker: '',
    password: ''
  };

  /**
   * --------------------------------------------------------------------------------------------
   * VARIABLES PARA EL RESTABLECIMIENTO DE CONTRASEÑA
   * --------------------------------------------------------------------------------------------
   */
  isResetModalOpen = false;
  isCodeVerified = false;
  /**
     * --------------------------------------------------------------------------------------------
     * BODY PARA EL RESTABLECIMIENTO DE CONTRASEÑA
     * --------------------------------------------------------------------------------------------
     */
  resetData = {
    idWorker: '',
    code: '',
    newPassword: ''
  };


  constructor(
    private router: Router,
    private myServices: MyServices,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  /**
   * --------------------------------------------------------------------------------------------
   * CICLO DE VIDA: ionViewWillEnter
   * SE EJECUTA CADA VEZ QUE LA VISTA VA A ENTRAR.
   * LIMPIA EL FORMULARIO PARA ASEGURAR QUE NO QUEDEN DATOS DE SESIONES ANTERIORES.
   * --------------------------------------------------------------------------------------------
   */
  ionViewWillEnter() {
    // Limpiamos los campos al entrar en la pantalla de login (post-logout)
    this.resetForm();
  }

  openResetModal() {
    this.isResetModalOpen = true;
  }

  closeResetModal() {
    this.isResetModalOpen = false;
    this.isCodeVerified = false;
    this.resetData = {
      idWorker: '',
      code: '',
      newPassword: ''
    };
  }

  /**
   * --------------------------------------------------------------------------------------------
   * FUNCIÓN: openUserTab
   * MANEJA EL PROCESO DE INICIO DE SESIÓN.
   * 1. VALIDA CAMPOS VACÍOS.
   * 2. LLAMA AL SERVICIO DE LOGIN (MYSERVICES).
   * 3. GUARDA EL TOKEN/USUARIO EN LOCALSTORAGE.
   * 4. REDIRIGE A LA PÁGINA PRINCIPAL 'TAB-USER'.
   *------------------------------------------------------------------------------------
   */
  async openUserTab() {
    if (!this.loginData.idWorker || !this.loginData.password) {
      this.showAlert('Error', 'Por favor, rellena todos los campos.');
      return;
    }

    /**
     * --------------------------------------------------------------------------------------------
     * LIMPIAR LOCALSTORAGE ANTES DE INTENTAR LOGIN PARA EVITAR SESIONES ANTIGUAS
     * --------------------------------------------------------------------------------------------
     */
    localStorage.clear();

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      duration: 5000
    });
    await loading.present();

    this.myServices.login(this.loginData).subscribe({
      next: (res: any) => {
        loading.dismiss();

        /**
         * --------------------------------------------------------------------------------------------
         * GUARDAMOS LOS DATOS DEL USUARIO LOGUEADO
         * --------------------------------------------------------------------------------------------
         */
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('role', res.role);


        /**
         * --------------------------------------------------------------------------------------------
         * REDIRIGIMOS SEGÚN EL ROL
         * (AHORA INCLUSIVO)
         * TODOS LOS USUARIOS AUTENTICADOS VAN AL LAYOUT PRINCIPAL CON PESTAÑAS
         * --------------------------------------------------------------------------------------------
         */
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

  /*-----------------------------------------------------------------------------------
   * REINICIA LOS CAMPOS DEL FORMULARIO DE LOGIN
   *------------------------------------------------------------------------------------
   */
  resetForm() {
    this.loginData = {
      idWorker: '',
      password: ''
    };
  }



  /*-----------------------------------------------------------------------------------
   * MUESTRA UNA ALERTA NATIVA DE IONIC CON UN MENSAJE.
   * @param header TÍTULO DE LA ALERTA
   * @param message CUERPO DEL MENSAJE
   *------------------------------------------------------------------------------------
   */
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }


  /*---------------------------------------------------------------------------------
   * ENVÍA UN CÓDIGO DE VERIFICACIÓN AL USUARIO.
   * ID DEL USUARIO AL QUE SE LE ENVIARÁ EL CÓDIGO.
   *------------------------------------------------------------------------------------
   */
  async sendVerificationCode() {
    if (!this.resetData.idWorker) {
      this.showAlert('Error', 'Por favor, ingrese su número de empleado.');
      return;
    }

    /**
     * --------------------------------------------------------------------------------------------
     * MUESTRA UN INDICADOR DE CARGA DE 5 SEGUNDOS MIENTRAS SE ENVÍA EL CÓDIGO DE VERIFICACIÓN.
     * --------------------------------------------------------------------------------------------
     */
    const loading = await this.loadingController.create({
      message: 'Enviando código...',
      duration: 5000
    });
    await loading.present();

    const idWorkerNum = Number(this.resetData.idWorker);
    /**
     * --------------------------------------------------------------------------------------------
     * ENVÍA UN CÓDIGO DE VERIFICACIÓN AL USUARIO.
     * --------------------------------------------------------------------------------------------
     */
    this.myServices.sendResetCode(idWorkerNum).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.showAlert('Éxito', res.message);
        } else {
          this.showAlert('Error', res.message || 'No se pudo enviar el código.');
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        this.showAlert('Error', err.error?.message || 'Error al conectar con el servidor.');
      }
    });
  }

  /**
   * --------------------------------------------------------------------------------------------
   * RESTABLECE LA CONTRASEÑA DEL USUARIO.
   * NUEVA CONTRASEÑA DEL USUARIO.
   * --------------------------------------------------------------------------------------------
   */
  async resetPassword() {
    if (!this.resetData.newPassword) {
      this.showAlert('Error', 'Ingrese la nueva contraseña.');
      return;
    }

    /**
     * --------------------------------------------------------------------------------------------
     * MUESTRA UN INDICADOR DE CARGA DE 5 SEGUNDOS MIENTRAS SE RESTABLECE LA CONTRASEÑA.
     * --------------------------------------------------------------------------------------------
     */
    const loading = await this.loadingController.create({
      message: 'Actualizando contraseña...',
      duration: 5000
    });
    await loading.present();

    const idWorkerNum = Number(this.resetData.idWorker);

    /**
     * --------------------------------------------------------------------------------------------
     * RESTABLECE LA CONTRASEÑA DEL USUARIO.
     * --------------------------------------------------------------------------------------------
     */
    this.myServices.resetPassword(idWorkerNum, this.resetData.newPassword).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.showAlert('Éxito', 'Contraseña actualizada correctamente.');
          this.closeResetModal();
        } else {
          this.showAlert('Error', res.message || 'No se pudo actualizar la contraseña.');
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        this.showAlert('Error', err.error?.message || 'Error al conectar con el servidor.');
      }
    });
  }

  /*---------------------------------------------------------------------------------
   * VERIFICA EL CÓDIGO DE VERIFICACIÓN.
   * CÓDIGO DE VERIFICACIÓN DEL USUARIO.
   *------------------------------------------------------------------------------------
   */
  async verifyCode() {
    if (!this.resetData.code) {
      this.showAlert('Error', 'Ingrese el código de verificación.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando código...',
      duration: 5000
    });
    await loading.present();

    const idWorkerNum = Number(this.resetData.idWorker);

    /**
     * --------------------------------------------------------------------------------------------
     * VERIFICA EL CÓDIGO DE VERIFICACIÓN.
     * --------------------------------------------------------------------------------------------
     */
    this.myServices.verifyResetCode(idWorkerNum, this.resetData.code).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.isCodeVerified = true;
          this.showAlert('Éxito', 'Código verificado. Ahora puede ingresar su nueva contraseña.');
        } else {
          this.showAlert('Error', res.message || 'Código incorrecto.');
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error(err);
        this.showAlert('Error', err.error?.message || 'Error validando el código.');
      }
    });
  }




}
