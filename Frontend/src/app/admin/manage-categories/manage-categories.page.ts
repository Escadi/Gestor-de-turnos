import { Component, OnInit } from '@angular/core';
import { MyServices } from '../../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-manage-categories',
    templateUrl: './manage-categories.page.html',
    styleUrls: ['./manage-categories.page.scss'],
    standalone: false
})
export class ManageCategoriesPage implements OnInit {

    categories: any[] = [];
    categoryTree: any[] = []; // Estructura jerárquica para la vista

    // Modal control
    isModalOpen: boolean = false;
    editingId: number | null = null;

    categoryData = {
        name: '',
        accessLevel: 'Empleado',
        parentId: null as number | null
    };

    accessLevels = ['Admin', 'Dirección', 'Jefe de Administración', 'Supervisor', 'Empleado'];

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.myServices.getNameFunctions().subscribe((res: any) => {
            const rawCategories = res.map((cat: any) => ({
                ...cat,
                name: cat.name || cat.nameCategory,
                children: [] // Inicializar hijos
            }));
            this.buildTree(rawCategories);
        });
    }

    buildTree(categories: any[]) {
        const map = new Map();
        const roots: any[] = [];

        // Primero mapeamos todos los nodos
        categories.forEach(cat => {
            map.set(cat.id, { ...cat, children: [] });
        });

        // Luego construimos las relaciones
        categories.forEach(cat => {
            if (cat.parentId && map.has(cat.parentId)) {
                map.get(cat.parentId).children.push(map.get(cat.id));
            } else {
                roots.push(map.get(cat.id));
            }
        });

        this.categoryTree = roots;
        this.categories = categories; // Mantenemos la lista plana por si acaso
    }

    openAddModal() {
        this.resetForm();
        this.isModalOpen = true;
    }

    resetForm() {
        this.categoryData = {
            name: '',
            accessLevel: 'Empleado',
            parentId: null
        };
        this.editingId = null;
    }

    async saveCategory() {
        if (!this.categoryData.name) return;

        const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
        await loading.present();

        if (this.editingId) {
            this.myServices.updateCategory(this.editingId, this.categoryData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: (err) => {
                    console.error(err);
                    loading.dismiss();
                }
            });
        } else {
            this.myServices.createCategory(this.categoryData).subscribe({
                next: () => {
                    loading.dismiss();
                    this.isModalOpen = false;
                    this.loadData();
                },
                error: (err) => {
                    console.error(err);
                    loading.dismiss();
                }
            });
        }
    }

    editCategory(category: any) {
        this.editingId = category.id;
        this.categoryData = {
            name: category.name,
            accessLevel: category.accessLevel || 'Empleado',
            parentId: category.parentId
        };
        this.isModalOpen = true;
    }

    async deleteCategory(id: number) {
        const alert = await this.alertCtrl.create({
            header: '¿Eliminar categoría?',
            message: 'Eliminar una categoría padre dejará a los hijos sin asignar.',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    cssClass: 'delete-button',
                    handler: () => {
                        this.myServices.deleteCategory(id).subscribe(() => this.loadData());
                    }
                }
            ]
        });
        await alert.present();
    }

    closeModal() {
        this.isModalOpen = false;
    }

    // Lógica Drag & Drop
    async onDrop(event: CdkDragDrop<any>, targetCategory?: any) {
        // La instrucción event.event.stopPropagation() NO EXISTE en CdkDragDrop y causaba error.
        // CDK ya maneja la propagación si las listas están bien conectadas.

        const movedCategory = event.item.data;
        const newParentId = targetCategory ? targetCategory.id : null;

        // 1. REORDENAMIENTO EN LA MISMA LISTA
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            // Aquí podríamos guardar el nuevo orden si tu backend lo soporta
            return;
        }

        // 2. TRANSFERENCIA A OTRA LISTA (ANIDAMIENTO)

        // Anti-Ciclos: no mover un padre dentro de su propio hijo
        if (this.isDescendant(movedCategory.id, newParentId)) {
            const alert = await this.alertCtrl.create({
                header: 'Operación no válida',
                message: 'No puedes mover una categoría dentro de sus propios subordinados.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        // Movimiento visual inmediato para feedback instantáneo
        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
        );

        // Actualización en Backend (Silent)
        const updateData = {
            ...movedCategory,
            parentId: newParentId
        };

        const loading = await this.loadingCtrl.create({
            message: 'Guardando jerarquía...',
            duration: 2000 // Timeout de seguridad 
        });
        await loading.present();

        this.myServices.updateCategory(movedCategory.id, updateData).subscribe({
            next: () => {
                loading.dismiss();
                // Opcional: recargar para asegurar sincronización total, 
                // pero ya hemos movido visualmente el item, así que se ve fluido.
                // this.loadData(); 
            },
            error: (err) => {
                console.error(err);
                loading.dismiss();
                // Si falla, revertimos visualmente recargando
                this.loadData();
            }
        });
    }

    // Verificar si targetId es descendiente de sourceId para evitar ciclos
    isDescendant(sourceId: number, targetId: number | null): boolean {
        if (!targetId) return false;
        if (sourceId === targetId) return true;

        // Buscar el target en el árbol plano para ver sus padres
        let current = this.categories.find(c => c.id === targetId);
        while (current && current.parentId) {
            if (current.parentId === sourceId) return true;
            current = this.categories.find(c => c.id === current.parentId);
        }
        return false;
    }
}
