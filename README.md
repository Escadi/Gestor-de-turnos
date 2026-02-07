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

## 👤 Acceso por Defecto
Si utilizas la base de datos de prueba o el seed inicial:
*   **Usuario (ID)**: `11`
*   **Contraseña**: `admin`

### Permisos de Geolocalización
La aplicación utiliza geolocalización para el fichaje. Los permisos necesarios están configurados en `AndroidManifest.xml` y `strings.xml`. Asegúrate de concederlos al iniciar la app.

## ID para trabajador
*   **Usuario (ID)**: `1`
*   **Contraseña**: `worker`
