import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-worker',
  templateUrl: './add-worker.page.html',
  styleUrls: ['./add-worker.page.scss'],
  standalone: false
})
export class AddWorkerPage implements OnInit {


  nameFunctions: any[] = [];

  constructor(
    private workerService: MyServices,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadNameFunctions();
  }

  loadNameFunctions() {
    this.workerService.getNameFunctions().subscribe({
      next: (data: any) => {
        this.nameFunctions = data;
      },
    });
  }




}
