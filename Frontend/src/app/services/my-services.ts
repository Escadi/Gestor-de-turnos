import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyServices {

  baseUrl = environment.apiUrl;
  endpointWorker = `${this.baseUrl}/api/worker`;
  endpointTimeShifts = `${this.baseUrl}/api/timeshift`;
  endpointNameFunctions = `${this.baseUrl}/api/nameFuncion`;
  endpointShifts = `${this.baseUrl}/api/shifts`;
  endpointAI = `${this.baseUrl}/api/ai`;
  endpointRequest = `${this.baseUrl}/api/request`;
  endpointRequestType = `${this.baseUrl}/api/requestTypes`;
  endpointSigning = `${this.baseUrl}/api/signing`;
  endpointAuth = `${this.baseUrl}/api/auth`;
  endpointDepartment = `${this.baseUrl}/api/departament`;
  endpointAbences = `${this.baseUrl}/api/abences`;

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

  getWorker(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(`${this.endpointWorker}/${id}`, { headers });
  }

  createWorker(worker: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointWorker, worker, { headers });
  }

  updateWorker(id: number, worker: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointWorker}/${id}`, worker, { headers });
  }

  deleteWorker(id: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.delete(`${this.endpointWorker}/${id}`, { headers });
  }

  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR CATEGORIES (NAMEFUNCION)    |
   *  --------------------------------------------------------------
   */

  createCategory(category: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointNameFunctions, category, { headers });
  }

  updateCategory(id: number, category: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointNameFunctions}/${id}`, category, { headers });
  }

  deleteCategory(id: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.delete(`${this.endpointNameFunctions}/${id}`, { headers });
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

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR SHIFTS                      |
  *  --------------------------------------------------------------
  */

  createShift(shift: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointShifts, shift, { headers });
  }

  bulkCreateShifts(shifts: any[]) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(`${this.endpointShifts}/bulk`, { shifts }, { headers });
  }

  getShifts(idWorker?: number, state?: string) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (state) params.push(`state=${state}`);
    if (params.length > 0) this.endpointShifts += `?${params.join('&')}`;
    return this.httpClient.get(this.endpointShifts, { headers });
  }

  updateShift(id: number, shift: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.put(`${this.endpointShifts}/${id}`, shift, { headers });
  }

  publishShifts(dates?: string[]) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    const body = dates ? { dates } : {};
    return this.httpClient.put(this.endpointShifts, body, { headers });
  }

  /**
*  --------------------------------------------------------------
* |                      SERVICE FOR SHOW-SHIFTS                 |
*  --------------------------------------------------------------
*/

  getWorkerShifts(workerId: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(`${this.endpointShifts}/workerShifts/${workerId}`, { headers });
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

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR AI                          |
  *  --------------------------------------------------------------
  */

  generateShiftsWithAI(workers: any[], timeShifts: any[], dates: string[]) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    const body = {
      workers,
      timeShifts,
      dates
    };
    return this.httpClient.post(`${this.endpointAI}/generate-shifts`, body, { headers });
  }

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR REQUEST                     |
  *  --------------------------------------------------------------
  */

  getRequests(idWorker?: number, role?: string) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointRequest;
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (role) params.push(`role=${role}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.httpClient.get(url, { headers });
  }

  createRequest(request: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointRequest, request, { headers });
  }

  getRequestTypes() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointRequestType, { headers });
  }
  getRequestTypeById(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(`${this.endpointRequestType}/${id}`, { headers });
  }

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR AUTH                        |
  *  --------------------------------------------------------------
  */

  login(credentials: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(`${this.endpointAuth}/login`, credentials, { headers });
  }

  /**
 *  --------------------------------------------------------------
 * |                      SERVICE FOR SIGNING                     |
 *  --------------------------------------------------------------
 */
  getSignings(idWorker?: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointSigning;
    if (idWorker) url += `?idWorker=${idWorker}`;
    return this.httpClient.get(url, { headers });
  }
  createSigning(signing: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointSigning, signing, { headers });
  }

  /**
*  --------------------------------------------------------------
* |                      SERVICE FOR DEPARTAMENTS                |
*  --------------------------------------------------------------
*/

  getDepartments() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointDepartment, { headers });
  }

  createDepartment(department: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointDepartment, department, { headers });
  }

  updateDepartment(id: number, department: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointDepartment}/${id}`, department, { headers });
  }

  deleteDepartment(id: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.delete(`${this.endpointDepartment}/${id}`, { headers });
  }

  /**
*  --------------------------------------------------------------
* |                      SERVICE FOR ABENCES                |
*  --------------------------------------------------------------
*/

  getAbences() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointAbences, { headers });
  }

}
