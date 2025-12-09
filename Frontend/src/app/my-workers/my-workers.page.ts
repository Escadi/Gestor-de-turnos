import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-my-workers',
  templateUrl: './my-workers.page.html',
  styleUrls: ['./my-workers.page.scss'],
  standalone: false,
})
export class MyWorkersPage implements OnInit {

  worker: any = [];

  constructor(
    private myServices: MyServices
  ) { }

  ngOnInit() {
    this.getAllWorkers();
  }



  getAllWorkers() {
    this.myServices.getWorkers().subscribe({
      next: (data: any) => {
        this.worker = data;
      }
    });
  }

}
