import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  endpointAbences = `${this.baseUrl}/api/abences`;
  endpointDatabase = `${this.baseUrl}/api/database`;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.clear(); // Garantizar limpieza total
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }


  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR WORKERS                     |
   *  --------------------------------------------------------------
   */

  getWorkers(managerId?: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    let url = this.endpointWorker;
    if (managerId) {
      url += `?managerId=${managerId}`;
    }
    return this.httpClient.get(url, { headers });
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

  deleteRequest(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.delete(`${this.endpointRequest}/${id}`, { headers });
  }

  updateRequest(id: number, request: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.put(`${this.endpointRequest}/${id}`, request, { headers });
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
* |                      SERVICE FOR ABENCES                |
*  --------------------------------------------------------------
*/

  getAbences(idWorker?: number, role?: string) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointAbences;
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (role) params.push(`role=${role}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.httpClient.get(url, { headers });
  }

  getAbencesAll() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointAbences, { headers });
  }

  createAbence(formData: FormData) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointAbences, formData, { headers });
  }

  updateAbence(id: number, formData: FormData) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.put(`${this.endpointAbences}/${id}`, formData, { headers });
  }

  deleteAbence(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.delete(`${this.endpointAbences}/${id}`, { headers });
  }

  downloadBackup() {
    return this.httpClient.get(`${this.endpointDatabase}/download`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      responseType: 'blob'
    });
  }

  saveBackupLocal() {
    return this.httpClient.post(`${this.endpointDatabase}/save-local`, {}, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }

  getAddressFromCoords(lat: number, lng: number) {
    // Using Nominatim (OpenStreetMap) for reverse geocoding
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    return this.httpClient.get(url);
  }
}
