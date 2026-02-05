import { Component, OnInit } from '@angular/core';
import { MyServices } from '../services/my-services';

@Component({
  selector: 'app-tab-user',
  templateUrl: './tab-user.page.html',
  styleUrls: ['./tab-user.page.scss'],
  standalone: false
})
export class TabUserPage implements OnInit {

  requests: any[] = [];
  abences: any[] = [];


  constructor(private myServices: MyServices) { }

  ngOnInit() {
    this.loadRequests();
    this.loadAbences();
  }

  loadRequests() {
    this.myServices.getRequests().subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });
  }

  loadAbences() {
    this.myServices.getAbencesAll().subscribe({
      next: (data: any) => this.abences = data,
      error: (err) => console.error('Error cargando ausencias:', err)
    });
  }

  get pendingRequests(): number {
    return this.requests.filter(r => r.status === 'Pendiente').length;
  }

  get pendingAbences(): number {
    return this.abences.filter(r => r.status === 'Pendiente').length;
  }

}
