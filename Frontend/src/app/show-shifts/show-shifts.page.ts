import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-shifts',
  templateUrl: './show-shifts.page.html',
  styleUrls: ['./show-shifts.page.scss'],
  standalone: false
})
export class ShowShiftsPage implements OnInit {
  fechaBase: string = '';
  diasSemana: any[] = [];


  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.setSemanaDesdeHoy();
  }

  goToShifts() {
    this.router.navigateByUrl('/shifts');
  }
  goToWorkers() {
    this.router.navigateByUrl('/my-workers');
  }
  setSemanaDesdeHoy() {
    const hoy = new Date();
    const lunes = this.getLunes(hoy);

    this.fechaBase = lunes.toISOString().substring(0, 10);
    this.generarSemana();
  }

  //Función clave: obtener el lunes de la semana
  getLunes(fecha: Date) {
    const dia = fecha.getDay(); // 0=Dom, 1=Lun, 2=Mar...
    const diff = fecha.getDate() - dia + (dia === 0 ? -6 : 1);

    return new Date(fecha.setDate(diff));
  }

  generarSemana() {
    if (!this.fechaBase) return;

    this.diasSemana = [];

    const fecha = new Date(this.fechaBase);

    const nombres = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    for (let i = 0; i < 7; i++) {
      const f = new Date(fecha);
      f.setDate(f.getDate() + i);

      this.diasSemana.push({
        nombre: nombres[f.getDay()],
        numero: f.getDate(),
        fechaLarga: f.toISOString().substring(0, 10)
      });
    }
  }
}
