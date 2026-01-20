const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // En desarrollo cargamos la URL de Angular, en producción el archivo build
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../www/index.html')}`;
    win.loadURL(startUrl);

    // win.webContents.openDevTools(); // Descomentar para debug
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
