import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyServices {

  endpointWorker = "https://dialectal-maniform-amara.ngrok-free.dev/api/worker";
  endpointTimeShifts = "https://dialectal-maniform-amara.ngrok-free.dev/api/timeshift";
  endpointNameFunctions = "https://dialectal-maniform-amara.ngrok-free.dev/api/nameFuncion";
  endpointShifts = "https://dialectal-maniform-amara.ngrok-free.dev/api/shifts";

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

  updateWorker(id: number, worker: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.put(`${this.endpointWorker}/${id}`, worker, { headers });
  }

  deleteWorker(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.delete(`${this.endpointWorker}/${id}`, { headers });
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

  createShift(shift: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointShifts, shift, { headers });
  }

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR NAMEFUCTION                 |
  *  --------------------------------------------------------------
  */

  getNameFunctions() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointNameFunctions, { headers });
  }

}
