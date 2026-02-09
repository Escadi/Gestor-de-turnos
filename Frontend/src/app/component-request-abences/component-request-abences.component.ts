import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-component-request-abences',
  templateUrl: './component-request-abences.component.html',
  styleUrls: ['./component-request-abences.component.scss'],
  standalone: false
})
export class ComponentRequestAbencesComponent implements OnInit {

  // Inputs para recibir datos desde el padre
  @Input() title: string = 'Peticiones';
  @Input() buttonText: string = 'Nueva Petición';
  @Input() items: any[] = [];
  @Input() itemTypes: any[] = [];
  @Input() canViewAll: boolean = false;
  @Input() totalCount: number = 0;
  @Input() pendingCount: number = 0;

  // Outputs para emitir eventos al padre
  @Output() onItemClick = new EventEmitter<any>();
  @Output() onNewItemClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  /**
   * Emitir evento cuando se hace click en una petición/ausencia
   */
  handleItemClick(item: any) {
    this.onItemClick.emit(item);
  }

  /**
   * Emitir evento cuando se hace click en el botón de nueva petición/ausencia
   */
  handleNewItemClick() {
    this.onNewItemClick.emit();
  }

  /**
   * Obtener nombre del tipo de petición/ausencia
   */
  getTypeName(idType: number): string {
    const type = this.itemTypes.find(t => t.id === idType);
    return type ? type.typeRequest : 'Sin tipo';
  }

  /**
   * Obtener nombre del trabajador
   */
  getWorkerName(item: any): string {
    if (item.worker) {
      return `${item.worker.name} ${item.worker.surname}`;
    }
    return 'Trabajador desconocido';
  }

}
