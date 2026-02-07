# 📅 Gestor de Turnos

Un sistema integral para la gestión de turnos laborales, control de fichajes y administración de empleados. Diseñado para funcionar como aplicación web, móvil (Android) y de escritorio (Electron), permitiendo una gestión eficiente y transparente entre encargados y trabajadores.

## 🚀 Características Principales

### 📍 Control de Fichajes y Presencia
*   **Fichaje con Geolocalización**: Los trabajadores pueden registrar su entrada y salida. El sistema captura automáticamente la hora exacta y la ubicación (latitud y longitud) para verificar el lugar de trabajo.
*   **Historial de Fichajes**: Registro detallado de la jornada laboral.

### 📅 Gestión Avanzada de Turnos
*   **Asignación de Turnos**: Los encargados pueden crear, editar y asignar turnos a los trabajadores.
*   **Sistema de Estados ("Borrador" vs "Publicado")**: 
    *   **Borrador**: Los turnos se crean inicialmente en modo borrador, permitiendo a los encargados planificar sin notificar aún al empleado.
    *   **Publicado**: Una vez verificados, los turnos se publican y se vuelven visibles para el trabajador en su calendario personal.
*   **Visualización**: Calendario intuitivo para ver turnos asignados.

### 👥 Roles y Jerarquía
El sistema implementa una jerarquía de roles que define la visibilidad y permisos:
*   **Encargados/Administradores**: Tienen acceso global o departamental. Pueden ver los turnos, fichajes e incidencias de los trabajadores bajo su cargo.
*   **Trabajadores**: Solo pueden ver sus propios turnos, fichajes y realizar solicitudes.

### 📝 Solicitudes y Gestión Personal
*   **Solicitudes**: Los empleados pueden pedir vacaciones, comunicar bajas o realizar otras peticiones.
*   **Ausencias**: Gestión justificada de ausencias.

### 🏢 Departamentos y Organización
*   Clasificación de la plantilla por departamentos para facilitar la gestión masiva.

### 🤖 Integración IA
*   Funcionalidades potenciadas por Inteligencia Artificial (vía Groq SDK) para asistir en la gestión.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza una arquitectura moderna separada en Backend y Frontend:

### Frontend (`/Frontend`)
Construido con **Angular 20** e **Ionic 8**, ofreciendo una experiencia nativa y web.
*   **Plataformas**: Web (PWA), Android (Capacitor), Escritorio (Electron).
*   **Librerías Clave**: 
    *   `angular-calendar`: Gestión visual de turnos.
    *   `@capacitor/geolocation`: Acceso al GPS del dispositivo.
    *   `date-fns`: Manipulación de fechas.

### Backend (`/Backend`)
API RESTful construida con **Node.js** y **Express**.
*   **Base de Datos**: MySQL (gestionada con **Sequelize ORM**).
*   **Seguridad**: Autenticación mediante **JWT** y encriptación de contraseñas con **Bcrypt**.
*   **Extras**: `Multer` (subida de imágenes), `Groq SDK` (IA).

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
4.  Inicia el servidor:
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

## 👤 Acceso por Defecto
Si utilizas la base de datos de prueba o el seed inicial:
*   **Usuario (ID)**: `11`
*   **Contraseña**: `admin`

## ID para pruebas de roles
*   **Usuario (ID)**: `4`
*   **Contraseña**: `rh123`

## ID para trabajador
*   **Usuario (ID)**: `1`
*   **Contraseña**: `worker`
