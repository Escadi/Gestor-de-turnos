import { Component, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyServices } from 'src/app/services/my-services';

@Component({
    selector: 'app-worker-profile',
    templateUrl: './worker-profile.page.html',
    styleUrls: ['./worker-profile.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class WorkerProfilePage implements OnInit {

    worker: any = {};
    status: any = {};

    constructor(
        private myServices: MyServices,
        private menuCtrl: MenuController
    ) { }

    ngOnInit() {
        this.loadWorkerData();
        this.setupMenuForDesktop();

        // Listener para cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.setupMenuForDesktop();
        });
    }

    /**
     * Abre el menú automáticamente en desktop (>= 1000px)
     * En móvil, el menú estará habilitado pero cerrado
     */
    async setupMenuForDesktop() {
        const isDesktop = window.innerWidth >= 1000;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1000;
        const isMobile = window.innerWidth < 768;

        // Siempre habilitar el menú
        await this.menuCtrl.enable(true);

        // Configurar el menú para que no se cierre al hacer click fuera en desktop
        if (isDesktop) {
            // Deshabilitar el cierre automático por click fuera del menú
            await this.menuCtrl.open();

        } else if (isTablet || isMobile) {
            // En móvil/tablet, habilitar gestos y cerrar el menú

            await this.menuCtrl.close();
        }
    }

    /**
     * Carga los datos del trabajador desde localStorage y luego desde el backend
     */
    loadWorkerData() {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                const idWorker = userData.idWorker;

                if (idWorker) {
                    // Cargar datos completos del trabajador desde el backend
                    this.myServices.getWorker(idWorker).subscribe({
                        next: (data: any) => {
                            this.worker = data;
                            console.log('Datos completos del trabajador cargados:', this.worker);
                        },
                        error: (err: any) => {
                            console.error('Error cargando datos del trabajador:', err);
                            // Si falla, usar los datos básicos del localStorage
                            this.worker = userData;
                        }
                    });
                } else {
                    console.warn('No se encontró idWorker en localStorage');
                    this.worker = {};
                }
            } catch (error) {
                console.error('Error al parsear datos del usuario:', error);
                this.worker = {};
            }
        } else {
            console.warn('No hay datos de usuario en localStorage');
            this.worker = {};
        }
    }
    /**  
     *  ----------------------------------------------------
     * CONTROLADOR DE STATUS (ESTADO)                           
     *  ----------------------------------------------------
     */


    // OBTENER EL NOMBRE DEL ESTADO A PARTIR DE LA ID QUE TIENE
    obtenerNombreStatus(idStatus: number): string {
        const status = this.status.find((s: any) => s.id === idStatus);
        if (!status) return 'Sin estado';
        return status.name;
    }

    /**
     * Obtiene el color del chip según el estado del trabajador
     */
    getStatusColor(): string {
        if (!this.worker.status) return 'medium';

        const statusName = this.worker.status.name?.toLowerCase();

        // Mapeo de estados a colores de Ionic
        if (statusName?.includes('activo') || statusName?.includes('active')) {
            return 'success';
        } else if (statusName?.includes('inactivo') || statusName?.includes('inactive')) {
            return 'danger';
        } else if (statusName?.includes('vacaciones') || statusName?.includes('vacation')) {
            return 'warning';
        } else if (statusName?.includes('baja') || statusName?.includes('leave')) {
            return 'medium';
        } else if (statusName?.includes('pendiente') || statusName?.includes('pending')) {
            return 'tertiary';
        }

        return 'primary'; // Color por defecto
    }









}
