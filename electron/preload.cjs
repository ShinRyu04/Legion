// Preload: the only bridge between renderer and main. Never expose raw ipcRenderer.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('legion', {
  ping: () => ipcRenderer.invoke('app:ping'),
  version: () => ipcRenderer.invoke('app:version'),
});
