import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MyServices } from '../../services/my-services';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.page.html',
    styleUrls: ['./admin-home.page.scss'],
    standalone: false
})
/**
 * ------------------------------------------------------------------------------------------
 * CONTROLADOR: ADMINHOMEPAGE
 * PÁGINA DE ATERRIZAJE PARA USUARIOS CON ROL DE ADMINISTRADOR.
 * MUESTRA EL MENÚ DE MÓDULOS DE GESTIÓN DISPONIBLES.
 * ------------------------------------------------------------------------------------------
 */
export class AdminHomePage implements OnInit {
    /**
     * ------------------------------------------------------------------------------------------
     * VARIABLES A PARTIR DE MODULOS DE GESTIÓN DEL SISTEMA CREANDOLO EN UN FOR
     * EN EL HTML PARA QUE SE CREE CADA UNO DE LOS MODULOS
     * ------------------------------------------------------------------------------------------
     */
    adminModules = [
        {
            title: 'Gestionar Trabajadores',
            description: 'Crear, modificar y eliminar empleados y sus credenciales.',
            icon: 'people-outline',
            color: 'primary',
            route: '/admin/workers'
        },
        {
            title: 'Estructura y Roles',
            description: 'Gestionar el organigrama, departamentos y niveles de acceso.',
            icon: 'share-social-outline',
            color: 'success',
            route: '/admin/categories'
        },
        {
            title: 'Base de Datos',
            description: 'Generar copias de seguridad de las tablas y sus datos.',
            icon: 'server-outline',
            color: 'warning',
            route: '/admin/database'
        }
    ];

    constructor(
        private router: Router,
        private navCtrl: NavController,
        private myServices: MyServices
    ) { }

    ngOnInit() {
    }

    /**
     * -------------------------------------------------------------------------------------------
     * NAVEGA A LA RUTA ESPECIFICADA.
     * @param route Ruta interna de la aplicación (ej: /admin/workers)
     * -------------------------------------------------------------------------------------------
     */
    navigateTo(route: string) {
        this.router.navigateByUrl(route);
    }

    /**
     * -------------------------------------------------------------------------------------------
     * REGRESA A LA PÁGINA ANTERIOR.
     * -------------------------------------------------------------------------------------------
     */
    goBack() {
        this.navCtrl.back();
    }

    /**
     * -------------------------------------------------------------------------------------------
     * CIERRA LA SESIÓN DEL USUARIO.
     * -------------------------------------------------------------------------------------------
     */
    logout() {
        this.myServices.logout();
    }

}
