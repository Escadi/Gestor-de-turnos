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

La solución está dividida en dos grandes bloques: Backend (API) y Frontend (Cliente).

### 📂 Backend
Servidor Node.js con Express y Sequelize (ORM).

*   **`/Config`**: Configuración de la base de datos y variables de entorno.
*   **`/Controller`**: Lógica de negocio y controladores de los endpoints (Auth, Workers, Shifts, Requests...).
*   **`/Model`**: Definición de modelos de datos (Sequelize) que mapean las tablas de MySQL.
*   **`/Route`**: Definición de las rutas de la API y asignación de controladores.
*   **`/Middleware`**: Middleware de autenticación y validación de tokens.
*   **`/Service`**: Servicios auxiliares y lógica compleja (ej. generación de PDFs, IA).
*   **`Server.js`**: Punto de entrada de la aplicación.

### 📂 Frontend
Aplicación híbrida desarrollada con Ionic y Angular.

*   **`/src/app`**: Código fuente principal.
    *   **`/services`**: Servicios HTTP para la comunicación con el Backend.
    *   **`/tab-user`**: Layout principal con pestañas para la navegación del usuario.
    *   **`/admin`**: Módulo de administración global.
    *   **`/user-worker`**: Funcionalidades específicas del trabajador (Fichaje, Reloj).
    *   **`/shifts`**: Gestión y asignación de turnos (Encargados).
    *   **`/show-shifts`**: Visualización de turnos (Trabajadores).
    *   **`/approvals`**: Panel de aprobaciones de solicitudes.
    *   **`/my-workers`**: Listado y gestión de empleados a cargo.
    *   **`/request-*`**: Módulos para la gestión de solicitudes y ausencias.



---

## 🗺️ Mapa del Sitio y Arquitectura Técnica

Detalle técnico de las páginas, controladores, lógica interna y APIs externas utilizadas.

### 🏠 Páginas de Acceso y Usuario (Trabajador)

#### 1. Fichar / Reloj (`/clock`)
*   **Controlador**: `WorkerClockPage` (`worker-clock.page.ts`)
*   **Lógica Principal**: Gestiona el registro de tiempos y geolocalización. Utiliza un temporizador en tiempo real y calcula horas trabajadas basándose en pares de fichajes (Entrada/Salida).
*   **Funciones y APIs**:
    *   **`initMap()`**: Inicializa el mapa interactivo y centra la vista en el usuario.
        *   *Lógica*: Usa `Geolocation.getCurrentPosition()` para obtener coordenadas (`lat`, `lng`).
        *   *APIs*: **Leaflet JS** (Librería de mapas de código abierto) + **OpenStreetMap** (Proveedor de tiles).
        *   *Dependencia*: **@capacitor/geolocation**. Accede al hardware GPS nativo del dispositivo.
    *   **`clockIn()` / `clockOut()`**: Registra el fichaje.
        *   *Lógica*: Captura la ubicación actual y envía un objeto JSON con el ID del trabajador, fecha y coordenadas.
        *   *API*: **Backend REST API** (`POST /api/signings`).
    *   **`calculateDailySummary()`**: Cálculo local de horas trabajadas.
        *   *Lógica*: Algoritmo interno en TypeScript (sin API externa). Itera sobre el array de fichajes del día, emparejando entradas y salidas para sumar diferencias de tiempo (`timestamp`) y determinar si el empleado está "Dentro" o "Fuera".

#### 2. Mis Turnos (`/show-shifts`)
*   **Controlador**: `ShowShiftsPage` (`show-shifts.page.ts`)
*   **Lógica Principal**: Muestra el cuadrante semanal del usuario logueado.
*   **Funciones y APIs**:
    *   **`loadWorkerShifts()`**: Carga los datos crudos del servidor.
        *   *API*: **Backend REST API** (`GET /api/shifts/worker/:id`).
    *   **`processShiftsForWeek(shifts)`**: Transformación de datos para la UI.
        *   *Lógica*: Algoritmo TypeScript que convierte una lista plana de objetos de base de datos en una matriz visual de semana (Lunes-Domingo). Mapea cada día con su turno correspondiente, calculando horas totales y asignando clases CSS y colores (`getShiftColor`) según el tipo de turno.

#### 3. Mis Solicitudes (`/my-requests`)
*   **Controlador**: `MyRequestsPage` (`my-requests.page.ts`)
*   **Lógica Principal**: Listado de estado de peticiones personales.
*   **Funciones y APIs**:
    *   **`loadRequests()`**: Obtiene el historial de solicitudes.
        *   *API*: **Backend REST API** (`GET /api/requests`). Filtra por ID de usuario en la consulta SQL del backend.
    *   **`getStatusColor(status)`**: UI Helper.
        *   *Lógica*: Devuelve la clase CSS para el badge de estado (Pendiente=Warning, Aprobada=Success, Rechazada=Danger).

#### 4. Solicitar Permiso (`/request-worker`)
*   **Controlador**: `RequestWorkerPage` (`request-worker.page.ts`)
*   **Lógica Principal**: Formulario CRUD para crear nuevas peticiones de ausencia o cambios.
*   **Funciones y APIs**:
    *   **`submitRequest()`**: Envío de formulario.
        *   *Lógica*: Valida los campos requeridos y construye el payload.
        *   *API*: **Backend REST API** (`POST /api/requests`). El backend valida y almacena la petición en MySQL.
    *   **`canViewAll`**: Gestión de permisos.
        *   *Lógica*: Getter local que determina si el usuario tiene rol suficiente para ver todas las peticiones o solo las propias en la interfaz.

### 💼 Páginas de Gestión (Encargados)

#### 5. Gestor de Turnos (`/shifts`)
*   **Controlador**: `ShiftsPage` (`shifts.page.ts`)
*   **Lógica Principal**: Matriz compleja de Usuarios x Días para asignar y editar turnos masivamente.
*   **Funciones y APIs**:
    *   **`cargarTurnosExistentes()`**: Renderizado de la cuadrícula.
        *   *Lógica*: Mapea la respuesta de la API a un objeto indexado por ID y Fecha (`turnos[workerId][fecha] = idTurno`) para un acceso O(1) al renderizar la tabla.
        *   *API*: **Backend REST API**. Obtiene todos los turnos del rango de fechas seleccionado.
    *   **`ejecutarGeneracionIA()`**: Inteligencia Artificial.
        *   *API*: **Groq AI** (vía Backend).
        *   *Detalle técnico*: El backend envía el contexto (trabajadores disponibles y reglas) a un LLM (Llama 3 en Groq Cloud). La respuesta es un JSON estructurado con la propuesta óptima de turnos, que el frontend fusiona respetando los candados (`locked`).
    *   **`exportPdf()`**: Generación de informes.
        *   *API*: **Puppeteer** (Node.js Library).
        *   *Detalle técnico*: El frontend envía el HTML crudo de la tabla al backend. El backend lanza una instancia de Chrome "headless" con Puppeteer, renderiza el HTML y devuelve un buffer PDF descargable.

#### 6. Aprobaciones (`/approvals`)
*   **Controlador**: `ApprovalsPage` (`approvals.page.ts`)
*   **Lógica Principal**: Bandeja de entrada unificada para gestionar Solicitudes y Ausencias pendientes.
*   **Funciones y APIs**:
    *   **`loadData()`**: Carga de datos paralela.
        *   *API*: **RxJS forkJoin** (o llamadas asíncronas paralelas). Realiza peticiones simultáneas a los endpoints de `/requests` y `/abences`, combinando los resultados en una única lista de tareas pendientes.
    *   **`updateStatus(item, status, origin)`**: Actualización de estado.
        *   *Lógica*: Método polimórfico. Si el origen es 'absence', construye un objeto `FormData` para soportar archivos adjuntos; si es 'request', usa JSON estándar.
        *   *API*: **Backend REST API** (`PUT`). Actualiza el registro en MySQL.

#### 7. Mis Empleados (`/my-workers`)
*   **Controlador**: `MyWorkersPage` (`my-workers.page.ts`)
*   **Lógica Principal**: Directorio de personal con filtrado en tiempo real.
*   **Funciones y APIs**:
    *   **`filterWorkers(event)`**: Búsqueda instantánea.
        *   *Lógica*: Implementa un filtrado de arrays en el cliente (Frontend) comprobando si el término de búsqueda coincide con alguna parte del Nombre, Apellido, ID o Puesto del trabajador, evitando recargas innecesarias al servidor.

### 🛡️ Administración del Sistema

#### 8. Gestión Global Usuarios (`/admin/workers`)
*   **Controlador**: `ManageWorkersPage` (`manage-workers.page.ts`)
*   **Lógica Principal**: CRUD administrativo sin restricciones de jerarquía.
*   **Funciones y APIs**:
    *   **`saveWorker()` / `deleteWorker()`**: Persistencia de datos.
        *   *API*: **Backend REST API**. CRUD completo sobre la tabla `workers` en MySQL. Utiliza encriptación Bcrypt en el backend para las contraseñas al crear o editar usuarios.

#### 9. Estructura de Datos (Modelos)
Ejemplos de las estructuras principales usadas en el frontend:
*   **Worker**: `{ id, name, surname, role, idFunction, locked, ... }`
*   **Shift**: `{ idTimeShift, date, workerId, state, locked }`
*   **Signing**: `{ idWorker, date, lat, lng }`



## 🛠️ Tecnologías y Herramientas

Sitio construido con un stack moderno y robusto, enfocado en el rendimiento y la escalabilidad.

### Frontend (Cliente)
*   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (v5.9) & HTML5 / SCSS.
*   **Framework**: [Angular](https://angular.io/) (v20) - Última versión del framework de Google.
*   **UI Framework**: [Ionic](https://ionicframework.com/) (v8) - Componentes móviles nativos y adaptables.
*   **Plataforma Móvil**: [Capacitor](https://capacitorjs.com/) (v7) - Puente nativo para Android y iOS.
    *   *Plugins*: Geolocation, Haptics, Keyboard, Status Bar.
*   **Escritorio**: [Electron](https://www.electronjs.org/) (v40) - Empaquetado nativo para Windows (construido con `electron-builder`).
*   **Librerías Clave**:
    *   `angular-calendar`: Gestión visual de calendarios y turnos.
    *   `date-fns`: Manipulación robusta de fechas y horas.
    *   `RxJS`: Programación reactiva y manejo de eventos asíncronos.

### Backend (Servidor)
*   **Runtime**: [Node.js](https://nodejs.org/).
*   **Framework**: [Express.js](https://expressjs.com/) (v5).
*   **Base de Datos**: MySQL (manejado vía driver `mysql2`).
*   **ORM**: [Sequelize](https://sequelize.org/) - Abstracción y modelado de datos SQL.
*   **Inteligencia Artificial**: [Groq SDK](https://groq.com/) - Integración con LLMs (Llama 3) para generación de turnos;
*   **Generación de Documentos**: [Puppeteer](https://pptr.dev/) - Renderizado de PDFs mediante Chrome Headless.
*   **Seguridad**:
    *   `bcryptjs`: Hashing seguro de contraseñas.
    *   `jsonwebtoken` (JWT): Autenticación basada en tokens.
*   **Utilidades**:
    *   `Multer`: Gestión de subida de archivos (imágenes de perfil).
    *   `Ngrok`: Túneles seguros para exposición local.
    *   `Nodemailer`: Gestión para el envio de correo electronico para verificación.

* **Base de Datos**:
    *   `MySQL`: Base de datos relacional.
    *   `Sequelize`: ORM para la interacción con la base de datos.
    *   `Clever Cloud`: Base de datos en la nube.

* **Inteligencia Artificial**:
    *   `Groq SDK`: Integración con LLMs (Llama 3) para generación de turnos.
    *   `Ngrok`: Túneles seguros para exposición local.

* **Generación de Documentos**:
    *   `Puppeteer`: Renderizado de PDFs mediante Chrome Headless.



* **Mail**:
    *   `nodemailer`: Envío de correos electrónicos.
    *   `@nodemailer/smtp-transport`: Transporte SMTP para nodemailer.
    *   `@nodemailer/ses-transport`: Transporte SES para nodemailer.
    *   `@nodemailer/ses-transport`: Transporte SES para nodemailer.

* **Git-Hub**:
    *   `GitHub`: Repositorio de código.
    *   `GitHub Actions`: CI/CD para despliegue automático.

* **GPS**:
    *   `GPS`: Sistema de posicionamiento global.
    *   `Geolocation API`: API para obtener la ubicación del usuario.

* **Haptics**:
    *   `Haptics`: API para obtener la vibración del dispositivo.

* **Keyboard**:
    *   `Keyboard`: API para obtener el teclado del dispositivo.

* **Status Bar**:
    *   `Status Bar`: API para obtener la barra de estado del dispositivo.

---


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

---

## 📜 Scripts del Proyecto (Referencia Rápida)

Comandos más utilizados durante el desarrollo:

| Entorno | Script | Descripción |
| :--- | :--- | :--- |
| **Backend** | `npm start` | Inicia el servidor Node.js en puerto 8080. |
| **Frontend** | `ionic serve` | Servidor de desarrollo web con recarga en caliente (localhost:8100). |
| **Frontend** | `npm run electron:dev` | Ejecuta la aplicación en modo escritorio (Electron + Angular). |
| **Frontend** | `npm run electron:build` | Compila y empaqueta la aplicación de escritorio (.exe). |
| **Frontend** | `npx cap sync android` | Sincroniza los cambios web con el proyecto nativo Android. |
| **Frontend** | `npx cap open android` | Abre el proyecto en Android Studio. |

---

## ❓ Solución de Problemas (Troubleshooting)

### 1. Error: "User denied Geolocation"
*   **Causa**: El navegador o dispositivo no tiene permisos de ubicación activados para la app.
*   **Solución**:
    *   **Browser**: Haz clic en el icono del candado en la barra de direcciones y permite "Ubicación".
    *   **Android**: Ve a Ajustes > Aplicaciones > TimeBeep > Permisos > Ubicación > "Permitir siempre" o "Permitir solo al usar la app".
    *   **PC**: Windows requiere que la opción "Permitir que las aplicaciones accedan a tu ubicación" esté activada en la configuración del sistema.

### 2. Error de Conexión a Base de Datos (Backend)
*   **Síntoma**: La consola muestra `SequelizeConnectionError` o `ECONNREFUSED`.
*   **Solución**:
    *   Verifica que el servicio MySQL está corriendo.
    *   Comprueba las credenciales en `Backend/.env` o `Backend/Config/configDB.js`.
    *   Asegúrate de que la base de datos `gestor_turnos` existe.

### 3. Pantalla en blanco en Electron (Build)
*   **Causa**: Rutas relativas incorrectas en `index.html`.
*   **Solución**: El script de build (`electron:build`) ya incluye la flag `--base-href ./`. Si falla, verifica que en `dist/index.html` la etiqueta base sea `<base href="./">`.

---

## 👨‍💻 Autor y Licencia

Este proyecto fue desarrollado como Proyecto de Final de Ciclo para **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

*   **Autor**: David Liaño Macías, ELiu Viera Lorenzo ([@denox74/@Escadi](https://github.com/Escadi))
*   **Licencia**: Este proyecto es de uso académico y privado. Todos los derechos reservados.
