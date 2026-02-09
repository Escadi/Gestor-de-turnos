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
/**
 * CONTROLADOR: ManageCategoriesPage
 * Gestiona el ABM (Alta, Baja, Modificación) de puestos de trabajo y su jerarquía.
 * Implementa lógica de Drag & Drop para definir relaciones jefe-subordinado (árbol).
 */
export class ManageCategoriesPage implements OnInit {

    viewMode: 'tree' | 'list' = 'tree';
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
    availableParents: any[] = [];

    constructor(
        private myServices: MyServices,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    /**
     * Carga todas las categorías desde el backend y construye el árbol visual.
     */
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

    /**
     * Transforma la lista plana de categorías en una estructura jerárquica (árbol)
     * basándose en el parentId de cada elemento.
     */
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
        this.categories = categories;
        this.updateAvailableParents();
    }

    updateAvailableParents() {
        // Por defecto, todos los que NO son empleados pueden ser jefes
        this.availableParents = this.categories.filter(c => c.accessLevel !== 'Empleado');
    }

    openAddModal() {
        this.resetForm();
        this.updateAvailableParents();
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

        // Al editar, NO podemos elegirnos a nosotros mismos ni a nuestros hijos como padres (evitar bucles)
        this.availableParents = this.categories.filter(c =>
            c.accessLevel !== 'Empleado' &&
            c.id !== category.id &&
            !this.isDescendant(category.id, c.id)
        );

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

    /**
     * Maneja el evento de soltar un elemento (Drag & Drop).
     * Actualiza la jerarquía (parentId) en local y en el backend.
     * Incluye validaciones para evitar ciclos y roles inválidos.
     */
    // Lógica Drag & Drop
    async onDrop(event: CdkDragDrop<any>, targetCategory?: any) {
        if (targetCategory && targetCategory.accessLevel === 'Empleado') {
            // Notificamos pero no bloqueamos el hilo de ejecución de CDK
            const alert = await this.alertCtrl.create({
                header: 'Restricción',
                message: 'Un "Empleado" no puede tener subordinados.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        const movedCategory = event.item.data;
        const newParentId = targetCategory ? targetCategory.id : null;

        // 1. MISMA LISTA: Reordenar visualmente
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            // Opcional: Guardar nuevo orden en backend si se desea
            return;
        }

        // 2. CAMBIO DE PADRE: Anti-ciclos
        if (this.isDescendant(movedCategory.id, newParentId)) {
            const alert = await this.alertCtrl.create({
                header: 'Error',
                message: 'No puedes mover un superior dentro de su propio subordinado.',
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        // Movimiento visual instantáneo
        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
        );

        // Actualización silenciosa en Backend
        const updateData = {
            ...movedCategory,
            parentId: newParentId
        };

        this.myServices.updateCategory(movedCategory.id, updateData).subscribe({
            next: () => {
                // Sincronización ligera
                this.categories = this.categories.map(c =>
                    c.id === movedCategory.id ? { ...c, parentId: newParentId } : c
                );
            },
            error: (err) => {
                console.error('Error al guardar jerarquía:', err);
                this.loadData(); // Revertir en caso de error
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

    logout() {
        this.myServices.logout();
    }
}
