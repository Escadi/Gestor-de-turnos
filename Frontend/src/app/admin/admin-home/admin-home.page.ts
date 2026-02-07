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
export class AdminHomePage implements OnInit {

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

    navigateTo(route: string) {
        this.router.navigateByUrl(route);
    }

    goBack() {
        this.navCtrl.back();
    }

    logout() {
        this.myServices.logout();
    }

}
