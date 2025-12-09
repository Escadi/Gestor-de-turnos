import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
  standalone: false,
})
export class MyWorkersPage implements OnInit {

  workers: any[] = [];

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getAllWorkers();
  }

  ionViewWillEnter() {
    this.getAllWorkers();
  }



  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => this.workers = data,
      error: (err) => console.error('Error cargando trabajadores:', err)
    });
  }

}
