// Legion main process: window, IPC, logging. All DB/network/spawn live here (never in renderer).
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const logger = require('./logger.cjs');

const isDev = !!process.env.VITE_DEV_SERVER_URL;
let mainWindow = null;

// Weak-GPU Windows machines can hang the renderer at startup; software rendering is fine for a chat app.
app.disableHardwareAcceleration();

function getDataDir() {
  // Decision: dev data stays in the repo folder, prod uses userData so experiments never mix.
  const dir = isDev
    ? path.join(__dirname, '..', 'data')
    : path.join(app.getPath('userData'), 'data');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    logger.warn('main', `cannot create data dir ${dir}: ${e.message}`);
  }
  return dir;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.on('did-start-loading', () => logger.info('window', 'did-start-loading'));
  mainWindow.webContents.on('dom-ready', () => logger.info('window', 'dom-ready'));
  mainWindow.webContents.on('did-finish-load', () => logger.info('window', 'did-finish-load'));
  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) =>
    logger.error('window', `did-fail-load ${code} ${desc} ${url}`)
  );
  mainWindow.webContents.on('unresponsive', () => logger.error('window', 'renderer unresponsive'));
  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    const userData = app.getPath('userData');
    logger.init(path.join(userData, 'logs'));
    const dataDir = getDataDir();
    logger.info(
      'main',
      `start app=${app.getVersion()} electron=${process.versions.electron} ` +
        `node=${process.versions.node} os=${process.platform} dataDir=${dataDir}`
    );

    ipcMain.handle('app:ping', () => ({ ok: true, ts: Date.now() }));
    ipcMain.handle('app:version', () => app.getVersion());

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  app.quit();
});
