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


  goShifts() {
    this.router.navigateByUrl('/shifts');
  }
  goWorkers() {
    this.router.navigateByUrl('/my-workers');
  }

}
