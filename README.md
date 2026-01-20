# Gestor de Turnos

Aplicación para la gestión de turnos laborales, desarrollada con un Backend en Node.js/Express y un Frontend en Ionic/Angular.

## Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Ejecución](#ejecución)
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

4.  **Base de Datos**:
    La configuración de la base de datos se encuentra en `Backend/Config/configDB.js`. Por defecto apunta a una instancia MySQL en la nube (Clever Cloud). Si deseas usar una base de datos local, modifica este archivo con tus credenciales.

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
# o
node server.js
```
El servidor se iniciará (por defecto en el puerto configurado o 3000) y conectará con la base de datos.
*Nota: Si usas ngrok, asegúrate de que el túnel se haya establecido correctamente.*

### Iniciar Frontend (Web)
Desde la carpeta `Frontend`:
```bash
ionic serve
```
Esto abrirá la aplicación en tu navegador predeterminado (usualmente `http://localhost:8100`).

---

## Compilación para Android

Si deseas probar la aplicación en un dispositivo Android:

1.  **Construir el proyecto web**:
    ```bash
    ionic build
    ```

2.  **Sincronizar con el proyecto nativo**:
    ```bash
    npx cap sync
    ```

3.  **Abrir en Android Studio**:
    ```bash
    npx cap open android
    ```

4.  Desde Android Studio, puedes ejecutar la aplicación en un emulador o en un dispositivo físico conectado.

### Permisos de Geolocalización
La aplicación utiliza geolocalización para el fichaje. Asegúrate de conceder los permisos de ubicación cuando la app lo solicite en el dispositivo.

