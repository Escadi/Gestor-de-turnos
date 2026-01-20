import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  /**  
   *  ----------------------------------------------------
   * |        CONTROLLER NAVIGATION ROUTER PAGE           |
   *  ----------------------------------------------------
   */

  goShifts() {
    this.router.navigateByUrl('/shifts');
  }
  goWorkers() {
    this.router.navigateByUrl('/my-workers');
  }
  goLogout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/home');
  }
  goSanctionsWorker() {
    this.router.navigateByUrl('/sanctions-worker');
  }
  goRequestWorker() {
    this.router.navigateByUrl('/request-worker');
  }
  goAbencesWorker() {
    this.router.navigateByUrl('/abences-worker');
  }

}
