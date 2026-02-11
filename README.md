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

## 🗺️ Mapa del Sitio y Funcionalidades

A continuación se detalla la funcionalidad de cada vista disponible en la aplicación Frontend.

### 🏠 Acceso y General
*   **Login (`/home`)**: Pantalla de inicio de sesión. Autenticación segura mediante ID de empleado y contraseña.

### 👷 Espacio del Trabajador
Accesible mediante la interfaz de pestañas principal.
*   **Fichar / Reloj (`/clock`)**:
    *   **Función Principal**: Registro de entrada y salida laboral.
    *   **📍 Geolocalización**: Utiliza la API de geolocalización del dispositivo para validar y registrar las coordenadas exactas (`lat`, `lng`) junto con la hora del fichaje. Muestra la ubicación actual en un mapa interactivo (Leaflet).
    *   **Historial Diario**: Cálculo automático de horas trabajadas en el día actual en tiempo real.
*   **Mis Turnos (`/show-shifts`)**:
    *   Visualización del cuadrante semanal personal.
    *   Indicadores visuales por colores según el tipo de turno (Mañana, Tarde, Noche, Libre).
    *   Cálculo automático de horas semanales totales asignadas.
*   **Mis Solicitudes (`/my-requests`)**: Seguimiento en tiempo real del estado de solicitudes (Pendiente, Aprobada, Rechazada).
*   **Solicitar (`/request-worker`)**: Formulario para solicitar vacaciones, días libres o cambios de turno.
*   **Sanciones (`/sanctions-worker`)**: Visualización del historial disciplinario personal.
*   **Perfil/Ajustes (`/settings`)**: Configuración de datos personales y preferencias de usuario.

### 💼 Espacio del Encargado (Gestión de Equipo)
Panel centralizado (`/manage`) para responsables de equipo.
*   **Gestión de Turnos (`/shifts`)**:
    *   **Cuadrante Interactivo**: Asignación y modificación de turnos para todo el equipo.
    *   **🤖 Generación con IA**: Herramienta avanzada que genera automáticamente una propuesta de turnos óptima basándose en roles y disponibilidad.
    *   **Publicación**: Sistema de estados (Borrador -> Publicado) para controlar cuándo ven los turnos los trabajadores.
    *   **Bloqueo de Turnos**: Funcionalidad de "candado" para cerrar semanas o trabajadores específicos y evitar modificaciones accidentales.
    *   **Exportar PDF**: Generación de reportes semanales listos para imprimir.
*   **Aprobaciones (`/approvals`)**: Bandeja de entrada para validar o rechazar solicitudes de vacaciones y permisos del equipo a cargo.
*   **Mis Empleados (`/my-workers`)**: Directorio visual del equipo asignado.
*   **Detalle de Empleado (`/workers-details-crud`)**: Edición completa de la ficha del trabajador, asignación de roles, funciones y datos de contrato.
*   **Registro de Actividad (`/worker-activity`)**: Log de acciones relevantes realizadas por los trabajadores.
*   **Gestión de Ausencias (`/request-abences-all`)**: Visión global y gestión de bajas médicas y ausencias justificadas.

### 🛡️ Administración del Sistema
Módulo exclusivo (`/admin`) para configuración global.
*   **Dashboard Admin (`/admin`)**: Métricas generales y accesos directos de administración.
*   **Gestión de Categorías (`/manage-categories`)**: Alta, baja y modificación de categorías profesionales y puestos de trabajo.
*   **Base de Datos (`/manage-database`)**: Herramientas de mantenimiento, respaldos y copias de seguridad de la base de datos.
*   **Gestión de Departamentos (`/manage-departament`)**: Estructuración de las áreas de la empresa.
*   **Gestión Global (`/manage-workers`)**: Control absoluto sobre todos los usuarios del sistema, con capacidad de editar cualquier perfil independientemente de su jerarquía.

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