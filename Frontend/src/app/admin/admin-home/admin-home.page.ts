import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

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
            title: 'Gestionar Categorías',
            description: 'Administrar funciones y categorías de la empresa.',
            icon: 'layers-outline',
            color: 'success',
            route: '/admin/categories'
        }
    ];

    constructor(
        private router: Router,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
    }

    navigateTo(route: string) {
        this.router.navigateByUrl(route);
    }

    goBack() {
        this.navCtrl.back();
    }

}
