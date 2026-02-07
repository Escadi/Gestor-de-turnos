# Gestor de Turnos

Aplicación para la gestión de turnos laborales, desarrollada con un Backend en Node.js/Express y un Frontend en Ionic/Angular.

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
- [Deploy](#deploy)
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

## Instalación y Configuración

### Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd Backend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```
    *Esto instalará paquetes clave como `express`, `mysql2`, `sequelize`, `cors`, `dotenv`, `@ngrok/ngrok`, `groq-sdk`, entre otros.*

3.  **Configuración de Variables de Entorno (.env)**:
    Crea un archivo llamado `.env` en la raíz de `Backend/` con el siguiente contenido:

    ```env
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

**Acceso Supervisor (Jefe De DTPO)**:
    - **ID de Empleado**: `4`
    - **Contraseña**: `rrhh`
    

**Acceso Trabajador (Empleado)**:
    - **ID de Empleado**: `1`
    - **Contraseña**: `worker`

*(Todas las credenciales están gestionadas con encriptación Bcrypt)*.

---

5.  ### Gestión de Imágenes (Multer)
    La aplicación utiliza `multer` para la subida de fotos de perfil.
    - **Carpeta Local**: Las imágenes se guardan físicamente en `Backend/public/Images/`.
    - **Configuración**: El límite de tamaño es de 5MB y solo se permiten formatos de imagen (jpg, png, gif).
    - **Importante**: Asegúrate de que la carpeta `Backend/public/Images` existe antes de subir archivos (ya ha sido creada automáticamente en esta configuración).

### Frontend

1.  Navega a la carpeta del frontend:
    ```bash
    cd ../Frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```
    *Esto incluirá dependencias de Ionic, Angular y plugins de Capacitor como `@capacitor/geolocation`.*

---

## Ejecución

### Iniciar Backend
Desde la carpeta `Backend`:
```bash
npm start
```
El servidor se iniciará y conectará con la base de datos MySQL.

### Escritorio (Windows via Electron)
Para ejecutar la aplicación como un programa de escritorio en Windows:
1. Navega a `Frontend`.
2. Ejecuta el modo desarrollo de Electron:
   ```bash
   npm run electron:dev
   ```
3. Para generar el instalador `.exe`:
   ```bash
   npm run electron:build
   ```

### Web (Navegador)
Desde la carpeta `Frontend`:
```bash
ionic serve
```
Esto abrirá la aplicación en `http://localhost:8100`.

---

## Compilación para Android

Si deseas probar la aplicación en un dispositivo Android:

1. **Añadir plataforma Android** (solo la primera vez):
    ```bash
    cd Frontend
    npx cap add android
    ```

2. **Construir el proyecto web**:
    ```bash
    ionic build
    ```

3. **Sincronizar con el proyecto nativo**:
    ```bash
    npx cap sync android
    ```

4. **Abrir en Android Studio**:
    ```bash
    npx cap open android
    ```

5. Desde Android Studio, selecciona tu dispositivo o emulador y pulsa el botón **Run**.

### Permisos de Geolocalización
La aplicación utiliza geolocalización para el fichaje. Los permisos necesarios están configurados en `AndroidManifest.xml` y `strings.xml`. Asegúrate de concederlos al iniciar la app.

---

### Deploy
El deploy de la base de datos y la webapp fue realizada en render (https://render.com/) teniendo el siguiente enlace:

*** https://timebeeppage.onrender.com/

