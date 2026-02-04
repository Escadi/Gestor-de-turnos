import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';
import { AlertController, LoadingController } from '@ionic/angular';



@Component({
  selector: 'app-abences-worker',
  templateUrl: './abences-worker.page.html',
  styleUrls: ['./abences-worker.page.scss'],
  standalone: false
})
export class AbencesWorkerPage implements OnInit {


  abences: any[] = [];

  constructor(
    private myServices: MyServices,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getAbences();
  }


  getAbences() {
    this.myServices.getAbences().subscribe((data: any) => {
      this.abences = data;
    });
  }
}
