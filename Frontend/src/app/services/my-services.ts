import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  endpointPdf = `${this.baseUrl}/api/pdf`;
  endpointPdfPuppeteer = `${this.baseUrl}/api/pdf/puppeteer`;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getApiUrl() {
    return this.baseUrl;
  }

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

  /**
   * Obtiene la lista de trabajadores.
   * backend: GET /api/worker
   * uso: my-workers.page.ts, workers-details-crud.page.ts, request-worker.page.ts, sanctions-worker.page.ts
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

  /**
   * Obtiene un trabajador por su ID.
   * backend: GET /api/worker/:id
   * uso: worker-profile.page.ts, workers-details-crud.page.ts
   */
  getWorker(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(`${this.endpointWorker}/${id}`, { headers });
  }

  /**
   * Crea un nuevo trabajador.
   * backend: POST /api/worker
   * uso: workers-details-crud.page.ts
   */
  createWorker(worker: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointWorker, worker, { headers });
  }

  /**
   * Actualiza la información de un trabajador existente.
   * backend: PUT /api/worker/:id
   * uso: workers-details-crud.page.ts, worker-profile.page.ts
   */
  updateWorker(id: number, worker: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointWorker}/${id}`, worker, { headers });
  }

  /**
   * Elimina (o desactiva) un trabajador.
   * backend: DELETE /api/worker/:id
   * uso: workers-details-crud.page.ts
   */
  deleteWorker(id: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.delete(`${this.endpointWorker}/${id}`, { headers });
  }

  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR CATEGORIES (NAMEFUNCION)    |
   *  --------------------------------------------------------------
   */

  /**
   * Crea una nueva categoría laboral (NameFunction).
   * backend: POST /api/nameFuncion
   * uso: settings.page.ts
   */
  createCategory(category: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointNameFunctions, category, { headers });
  }

  /**
   * Actualiza una categoría laboral existente.
   * backend: PUT /api/nameFuncion/:id
   * uso: settings.page.ts
   */
  updateCategory(id: number, category: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointNameFunctions}/${id}`, category, { headers });
  }

  /**
   * Elimina una categoría laboral.
   * backend: DELETE /api/nameFuncion/:id
   * uso: settings.page.ts
   */
  deleteCategory(id: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.delete(`${this.endpointNameFunctions}/${id}`, { headers });
  }

  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR TIME-SHIFTS                 |
   *  --------------------------------------------------------------
   */

  /**
   * Obtiene todos los turnos base (horarios predefinidos).
   * backend: GET /api/timeshift
   * uso: shifts.page.ts
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

  /**
   * Asigna un turno específico a un trabajador.
   * backend: POST /api/shifts
   * uso: shifts.page.ts
   */
  createShift(shift: any) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointShifts, shift, { headers });
  }

  /**
   * Crea múltiples turnos a la vez.
   * backend: POST /api/shifts/bulk
   * uso: shifts.page.ts (generación masiva)
   */
  bulkCreateShifts(shifts: any[]) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(`${this.endpointShifts}/bulk`, { shifts }, { headers });
  }

  /**
   * Obtiene los turnos asignados, con filtros opcionales.
   * backend: GET /api/shifts
   * uso: shifts.page.ts, show-shifts.page.ts
   */
  getShifts(idWorker?: number, state?: string) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointShifts;
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (state) params.push(`state=${state}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.httpClient.get(url, { headers });
  }

  /**
   * Actualiza un turno asignado.
   * backend: PUT /api/shifts/:id
   * uso: shifts.page.ts
   */
  updateShift(id: number, shift: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.put(`${this.endpointShifts}/${id}`, shift, { headers });
  }

  /**
   * Publica los turnos para que sean visibles por los trabajadores.
   * backend: PUT /api/shifts
   * uso: shifts.page.ts
   */
  publishShifts(dates?: string[]) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    const body = dates ? { dates } : {};
    return this.httpClient.put(this.endpointShifts, body, { headers });
  }

  /**
*  --------------------------------------------------------------
* |                      SERVICE FOR SHOW-SHIFTS                 |
*  --------------------------------------------------------------
*/

  /**
   * Obtiene los turnos de un trabajador específico.
   * backend: GET /api/shifts/workerShifts/:workerId
   * uso: worker-schedule.page.ts
   */
  getWorkerShifts(workerId: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.get(`${this.endpointShifts}/workerShifts/${workerId}`, { headers });
  }


  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR NAMEFUCTION                 |
  *  --------------------------------------------------------------
  */

  /**
   * Obtiene todas las categorías laborales (puestos/funciones).
   * backend: GET /api/nameFuncion
   * uso: settings.page.ts, workers-details-crud.page.ts
   */
  getNameFunctions() {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.get(this.endpointNameFunctions, { headers });
  }

  /**
  *  --------------------------------------------------------------
  * |                      SERVICE FOR AI                          |
  *  --------------------------------------------------------------
  */

  /**
   * Genera turnos automáticamente usando IA.
   * backend: POST /api/ai/generate-shifts
   * uso: shifts.page.ts
   */
  generateShiftsWithAI(workers: any[], timeShifts: any[], dates: string[]) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
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

  /**
   * Obtiene solicitudes (vacaciones, cambios, etc.) con filtros.
   * backend: GET /api/request
   * uso: request-worker.page.ts, request-abences-all.page.ts
   */
  getRequests(idWorker?: number, role?: string, subordinates: boolean = false) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointRequest;
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (role) params.push(`role=${role}`);
    if (subordinates) params.push(`subordinates=true`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.httpClient.get(url, { headers });
  }

  /**
   * Crea una nueva solicitud.
   * backend: POST /api/request
   * uso: request-worker.page.ts
   */
  createRequest(request: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointRequest, request, { headers });
  }

  /**
   * Obtiene los tipos de solicitudes disponibles.
   * backend: GET /api/requestTypes
   * uso: request-worker.page.ts
   */
  getRequestTypes() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointRequestType, { headers });
  }
  /**
   * Obtiene un tipo de solicitud por ID.
   * backend: GET /api/requestTypes/:id
   * uso: request-details.page.ts
   */
  getRequestTypeById(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(`${this.endpointRequestType}/${id}`, { headers });
  }

  /**
   * Elimina una solicitud.
   * backend: DELETE /api/request/:id
   * uso: request-worker.page.ts
   */
  deleteRequest(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.delete(`${this.endpointRequest}/${id}`, { headers });
  }

  /**
   * Actualiza el estado o información de una solicitud.
   * backend: PUT /api/request/:id
   * uso: approvals.page.ts
   */
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

  /**
   * Inicia sesión en la aplicación.
   * backend: POST /api/auth/login
   * uso: login.page.ts
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
  /**
   * Obtiene los fichajes (entradas/salidas) con filtro opcional por trabajador.
   * backend: GET /api/signing
   * uso: worker-profile.page.ts
   */
  getSignings(idWorker?: number) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointSigning;
    if (idWorker) url += `?idWorker=${idWorker}`;
    return this.httpClient.get(url, { headers });
  }
  /**
   * Registra un nuevo fichaje (entrada/salida).
   * backend: POST /api/signing
   * uso: worker-clock.page.ts
   */
  createSigning(signing: any) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    return this.httpClient.post(this.endpointSigning, signing, { headers });
  }


  /**
*  --------------------------------------------------------------
* |                      SERVICE FOR ABENCES                |
*  --------------------------------------------------------------
*/

  /**
   * Obtiene ausencias/justificaciones con filtros.
   * backend: GET /api/abences
   * uso: abences-worker.page.ts
   */
  getAbences(idWorker?: number, role?: string, subordinates: boolean = false) {
    const headers = { 'ngrok-skip-browser-warning': 'true' };
    let url = this.endpointAbences;
    const params: string[] = [];
    if (idWorker) params.push(`idWorker=${idWorker}`);
    if (role) params.push(`role=${role}`);
    if (subordinates) params.push(`subordinates=true`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.httpClient.get(url, { headers });
  }

  /**
   * Obtiene todas las ausencias registradas.
   * backend: GET /api/abences
   * uso: request-abences-all.page.ts
   */
  getAbencesAll() {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.get(this.endpointAbences, { headers });
  }

  /**
   * Crea una nueva ausencia, posiblemente con archivo adjunto.
   * backend: POST /api/abences
   * uso: abences-worker.page.ts
   */
  createAbence(formData: FormData) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointAbences, formData, { headers });
  }

  /**
   * Actualiza una ausencia existente (estado o archivo).
   * backend: PUT /api/abences/:id
   * uso: abences-worker.page.ts
   */
  updateAbence(id: number, formData: FormData) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.put(`${this.endpointAbences}/${id}`, formData, { headers });
  }

  /**
   * Elimina una ausencia.
   * backend: DELETE /api/abences/:id
   * uso: abences-worker.page.ts
   */
  deleteAbence(id: number) {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.delete(`${this.endpointAbences}/${id}`, { headers });
  }

  /**
   * Descarga un backup de la base de datos.
   * backend: GET /api/database/download
   * uso: settings.page.ts
   */
  downloadBackup() {
    return this.httpClient.get(`${this.endpointDatabase}/download`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      responseType: 'blob'
    });
  }

  /**
   * Guarda un backup de la base de datos localmente en el servidor.
   * backend: POST /api/database/save-local
   * uso: settings.page.ts
   */
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

  /**
   *  --------------------------------------------------------------
   * |                      SERVICE FOR PDF-CSV                |
   *  --------------------------------------------------------------
   */

  /**
   * Genera un PDF con los turnos.
   * backend: POST /api/pdf
   * uso: worker-activity.page.ts
   */
  generatePdf(data: any): Observable<Blob> {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointPdf, data, {
      headers,
      responseType: 'blob'
    });
  }

  generatePdfWithPuppeteer(data: any): Observable<Blob> {
    const headers = {
      'ngrok-skip-browser-warning': 'true'
    };
    return this.httpClient.post(this.endpointPdfPuppeteer, data, {
      headers,
      responseType: 'blob'
    });
  }
}
