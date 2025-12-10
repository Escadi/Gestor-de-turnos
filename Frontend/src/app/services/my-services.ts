import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyServices {

  endpointWorker = "https://dialectal-maniform-amara.ngrok-free.dev/api/worker";
  endpointTimeShifts = "https://dialectal-maniform-amara.ngrok-free.dev/api/timeshift";

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR WORKERS                     |
   *  --------------------------------------------------------------
   */

  getWorkers() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointWorker, { headers });
  }

  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR TIME-SHIFTS                 |
   *  --------------------------------------------------------------
   */

  getTimeShifts() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointTimeShifts, { headers });
  }

}
