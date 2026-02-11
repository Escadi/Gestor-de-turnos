# 📅 Gestor de Turnos

Un sistema integral para la gestión de turnos laborales, control de fichajes y administración de empleados. Diseñado para funcionar como aplicación web, móvil (Android) y de escritorio (Electron), permitiendo una gestión eficiente y transparente entre encargados y trabajadores.

## Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Ejecución](#ejecución)
  - [Escritorio (Windows via Electron)](#escritorio-windows-via-electron)
  - [Web](#web-navegador)
- [Compilación para Android](#compilación-para-android)

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:
- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [NPM](https://www.npmjs.com/) (incluido con Node.js)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli):
  ```bash
  npm install -g @ionic/cli
  ```
- Android Studio (si planeas compilar para Android)

---

## Estructura del Proyecto

- **/Backend**: Servidor API RESTful (Node.js, Express, MySQL).
- **/Frontend**: Aplicación móvil/web (Ionic, Angular).


---



---

## 🗺️ Mapa del Sitio y Arquitectura Técnica

Detalle técnico de las páginas, controladores y funciones principales.

### 🏠 Páginas de Acceso y Usuario (Trabajador)

#### 1. Fichar / Reloj (`/clock`)
*   **Controlador**: `WorkerClockPage` (`worker-clock.page.ts`)
*   **Lógica Principal**: Gestiona el registro de tiempos y geolocalización. Utiliza un temporizador en tiempo real y calcula horas trabajadas basándose en pares de fichajes (Entrada/Salida).
*   **Funciones Clave**:
    *   `initMap()`: Inicializa el mapa Leaflet. Usa `Geolocation.getCurrentPosition()` para obtener coordenadas (`lat`, `lng`) y centra el mapa en la ubicación del usuario.
    *   `clockIn()` / `clockOut()`: Captura la ubicación actual y llama a `createSigning()` del servicio API para registrar el fichaje con fecha y coordenadas.
    *   `calculateDailySummary()`: Algoritmo que procesa el array `history`. Si el número de fichajes es impar, el usuario está "Dentro"; si es par, está "Fuera". Calcula el tiempo transcurrido entre pares de fechas para sumar el total de horas trabajadas en el día.

#### 2. Mis Turnos (`/show-shifts`)
*   **Controlador**: `ShowShiftsPage` (`show-shifts.page.ts`)
*   **Lógica Principal**: Muestra el cuadrante semanal del usuario logueado.
*   **Funciones Clave**:
    *   `loadWorkerShifts()`: Obtiene los turnos específicos del trabajador llamando a `getWorkerShifts(id)`.
    *   `processShiftsForWeek(shifts)`: Transforma la lista plana de turnos en una estructura de semana (Lunes-Domingo). Mapea cada día con su turno correspondiente, calculando horas totales y asignando colores (`getShiftColor`) según el tipo de turno (Mañana, Tarde, Noche).

#### 3. Mis Solicitudes (`/my-requests`)
*   **Controlador**: `MyRequestsPage` (`my-requests.page.ts`)
*   **Lógica Principal**: Listado de estado de peticiones.
*   **Funciones Clave**:
    *   `loadRequests()`: Filtra las peticiones del usuario actual.
    *   `getStatusColor(status)`: Devuelve la clase CSS para el badge de estado (Pendiente=Warning, Aprobada=Success, Rechazada=Danger).

#### 4. Solicitar Permiso (`/request-worker`)
*   **Controlador**: `RequestWorkerPage` (`request-worker.page.ts`)
*   **Lógica Principal**: Formulario CRUD para crear peticiones.
*   **Funciones Clave**:
    *   `submitRequest()`: Valida el formulario y envía un objeto JSON con `idType`, `details` y `dates` al endpoint de creación.
    *   `canViewAll`: Getter que determina si el usuario tiene rol suficiente para ver todas las peticiones o solo las propias.

### 💼 Páginas de Gestión (Encargados)

#### 5. Gestor de Turnos (`/shifts`)
*   **Controlador**: `ShiftsPage` (`shifts.page.ts`)
*   **Lógica Principal**: Matriz compleja de Usuarios x Días para asignar turnos.
*   **Funciones Clave**:
    *   `cargarTurnosExistentes()`: Mapea la respuesta de la API a un objeto indexado `turnos[workerId][fecha] = idTurno` para renderizar la cuadrícula eficientemente.
    *   `ejecutarGeneracionIA()`: Invoca al servicio de IA (`generateShiftsWithAI`). Recibe una propuesta de turnos y la fusiona con los turnos actuales, respetando explícitamente los turnos que tengan el flag `locked`.
    *   `crearTurnos()`: Recorre la matriz de turnos, extrayendo aquellos modificados, y envía un array masivo (`bulkCreateShifts`) al backend para guardar cambios en lote.
    *   `isShiftLocked(workerId, date)`: Verifica si una celda específica está bloqueada, ya sea por bloqueo individual del turno o bloqueo global del trabajador.
    *   `exportPdf()`: Genera una cadena HTML dinámica con los datos de la tabla y la envía al servicio de Puppeteer para recibir un Blob PDF descargable.

#### 6. Aprobaciones (`/approvals`)
*   **Controlador**: `ApprovalsPage` (`approvals.page.ts`)
*   **Lógica Principal**: Bandeja de entrada unificada para Solicitudes y Ausencias.
*   **Funciones Clave**:
    *   `loadData()`: Realiza peticiones paralelas (`forkJoin` o separadas) para obtener `Requests` y `Ausencias` de los subordinados.
    *   `updateStatus(item, status, origin)`: Método genérico que actualiza el estado. Si es 'absence', construye un `FormData` (para manejar posibles adjuntos); si es 'request', envía JSON estándar. Actualiza el estado a 'Aprobada' o 'Rechazada'.

#### 7. Mis Empleados (`/my-workers`)
*   **Controlador**: `MyWorkersPage` (`my-workers.page.ts`)
*   **Lógica Principal**: Directorio filtrable de personal.
*   **Funciones Clave**:
    *   `getStatusSummary()`: Calcula estadísticas en tiempo real (ej. "3 Activos, 1 de Baja") iterando sobre el array de trabajadores visibles.
    *   `filterWorkers(event)`: Implementa búsqueda local multitermino. Filtra el array de trabajadores comprobando si el texto coincide con Nombre, Apellido, ID o Puesto.

### 🛡️ Administración del Sistema

#### 8. Gestión Global Usuarios (`/admin/workers`)
*   **Controlador**: `ManageWorkersPage` (`manage-workers.page.ts`)
*   **Lógica Principal**: CRUD administrativo sin restricciones.
*   **Funciones Clave**:
    *   `saveWorker()`: Determina si es creación o edición (`editingId`) y llama al servicio correspondiente (`createWorker` o `updateWorker`).
    *   `deleteWorker(id)`: Eliminación lógica o física del usuario y sus datos asociados.

#### 9. Estructura de Datos (Modelos)
*   **Worker**: `{ id, name, surname, role, idFunction, locked, ... }`
*   **Shift**: `{ idTimeShift, date, workerId, state, locked }`
*   **Signing**: `{ idWorker, date, lat, lng }`


## ⚙️ Instalación y Configuración

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (LTS)
*   MySQL Database
*   [Ionic CLI](https://ionicframework.com/docs/intro/cli) (`npm install -g @ionic/cli`)

### 1. Configuración del Backend

1.  Navega a la carpeta `Backend`:
    ```bash
    cd Backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  **Variables de Entorno (.env)**:
    Crea un archivo `.env` en la raíz de `Backend/` con:
    ```env
    PORT=8080
    # Configuración de Base de Datos (si no usas configDB.js por defecto)
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=tu_contraseña
    DB_NAME=gestor_turnos
    
    # API Keys
    GROQ_API_KEY=tu_clave_api_groq
    NGROK_AUTHTOKEN=tu_token_ngrok
    ```
    *(Asegúrate de reemplazar los valores con tus credenciales reales)*.
    *Para GROQ_API_KEY - tienen que insertar la api key registrandose en https://console.groq.com/keys*.
    *Para NGROK_AUTHTOKEN - Tienen que insertar el token creado en https://ngrok.com/docs/getting-started/javascript* 

5.  **Base de Datos**:
    La configuración de la base de datos se encuentra en `Backend/Config/configDB.js`. Por defecto apunta a una instancia MySQL en la nube (Clever Cloud). Si deseas usar una base de datos local, modifica este archivo con tus credenciales.

**Acceso Administrador (Por defecto)**:
    - **ID de Empleado**: `11`
    - **Contraseña**: `admin`
    *(Estas credenciales están gestionadas con encriptación Bcrypt)*.

5.  ### Gestión de Imágenes (Multer)
    La aplicación utiliza `multer` para la subida de fotos de perfil.
    - **Carpeta Local**: Las imágenes se guardan físicamente en `Backend/public/uploads/`.
    - **Configuración**: El límite de tamaño es de 5MB y solo se permiten formatos de imagen (jpg, png, gif).
    - **Importante**: Asegúrate de que la carpeta `Backend/public/uploads` existe antes de subir archivos (ya ha sido creada automáticamente en esta configuración).

### Frontend

1.  Navega a la carpeta del frontend:
    ```bash
    npm start
    ```

### 2. Configuración del Frontend

1.  Navega a la carpeta `Frontend`:
    ```bash
    cd Frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

---

## ▶️ Ejecución

### Web (Navegador)
Para desarrollo y pruebas rápidas:
```bash
# Desde carpeta Frontend
ionic serve
```
Accede a `http://localhost:8100`.

### Escritorio (Windows)
La aplicación utiliza Electron para ejecutarse como programa nativo de Windows.
```bash
# Desde carpeta Frontend
npm run electron:dev
```
Para construir el instalador `.exe`:
```bash
npm run electron:build
```

### Android (Móvil)
Para desplegar en un dispositivo o emulador Android:
1.  **Sincronizar**:
    ```bash
    npx cap sync android
    ```
2.  **Abrir en Android Studio**:
    ```bash
    npx cap open android
    ```
3.  Ejecutar desde Android Studio.

*Nota: Asegúrate de conceder permisos de ubicación en el dispositivo para que funcione el fichaje.*

---

## ✨ Características y Refinamientos Recientes

### 🎨 Estandarización de Interfaz (UI)
- **Toolbars Unificadas**: Todas las pantallas cuentan ahora con una barra de herramientas idéntica en estructura, alineación y estilo, eliminando flechas de retroceso innecesarias para una navegación más fluida.
- **Identidad Visual**: El logo oficial (reloj) se ha integrado de forma consistente en la parte superior izquierda de cada sección.
- **Lógica de Colores**:
    - **Amarillo (`warning`)**: Reservado exclusivamente para módulos de Administración.
    - **Limpio (Blanco/Transparente)**: Para todas las secciones de uso del trabajador (Fichaje, Horarios, Peticiones, etc.).

### 🛡️ Seguridad y Roles
- **Ajustes Restringidos**: Los empleados de rango "Empleado" pueden visualizar sus datos personales pero tienen bloqueada la edición (campos de solo lectura y botón de guardar oculto).
- **Jerarquía Funcional**: Implementación de un filtro de seguridad en la asignación de puestos. Un responsable solo puede asignar a otros trabajadores su mismo rango o rangos inferiores, evitando promociones no autorizadas.
- **Normalización de Datos**: Corrección en la visualización de nombres de funciones/categorías en todos los selectores de la app.

### 🐛 Correcciones Técnicas
- **Formato de Fechas**: Solucionado el error de "Invalid Time" en el módulo de Ausencias asegurando el cumplimiento del estándar ISO.
- **Limpieza de Código**: Eliminación de redundancias en SCSS y corrección de etiquetas HTML mal cerradas que provocaban errores de compilación.

---

## 👤 Acceso por Defecto
Si utilizas la base de datos de prueba o el seed inicial:

### Administrador
*   **Usuario (ID)**: `11`
*   **Contraseña**: `admin`

### Trabajadores
*   **ID**: `1`, **Contraseña**: `worker`
*   **ID**: `2`, **Contraseña**: `worker2`

### Recursos Humanos
*   **ID**: `4`, **Contraseña**: `rh123`

### Jefe de Administración
*   **ID**: `9`, **Contraseña**: `ad12`

---

### Permisos de Geolocalización
La aplicación utiliza geolocalización para el fichaje. Los permisos necesarios están configurados en `AndroidManifest.xml` y `strings.xml`. Asegúrate de concederlos al iniciar la app.