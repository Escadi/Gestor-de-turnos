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
  canManage: boolean = false;


  constructor(private myServices: MyServices) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkPermissions();
    this.loadRequests();
    this.loadAbences();
  }

  checkPermissions() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Validamos si tiene algún rol de gestión (Cualquiera excepto 'Empleado')
      const role = user.role ? user.role.toLowerCase() : '';
      this.canManage = role !== 'empleado' && role !== 'user' && role !== '';
    }
  }

  loadRequests() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    this.myServices.getRequests(user.idWorker, user.role).subscribe({
      next: (data: any) => this.requests = data,
      error: (err) => console.error('Error cargando peticiones:', err)
    });
  }

  loadAbences() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    this.myServices.getAbences(user.idWorker, user.role).subscribe({
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

  logout() {
    this.myServices.logout();
  }

}
