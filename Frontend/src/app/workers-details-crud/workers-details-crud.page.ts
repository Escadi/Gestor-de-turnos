import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workers-details-crud',
  templateUrl: './workers-details-crud.page.html',
  styleUrls: ['./workers-details-crud.page.scss'],
  standalone: false,
})
export class WorkersDetailsCrudPage implements OnInit {

  worker: any = {};

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.worker = navigation.extras.state['worker'];
    }
  }

  ngOnInit() {
  }

  cancelar() {
    this.router.navigate(['/my-workers']);
  }

  guardarCambios() {
    // Aquí puedes implementar la lógica para guardar los cambios
    console.log('Guardando cambios:', this.worker);
    this.router.navigate(['/my-workers']);
  }

}
