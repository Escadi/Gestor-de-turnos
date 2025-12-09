import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyServices {

  endpointWorker = "https://dialectal-maniform-amara.ngrok-free.dev/api/worker";

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR WORKERS                     |
   *  --------------------------------------------------------------
   */

  getWorkers() {
    return this.httpClient.get(this.endpointWorker)
  }

}
