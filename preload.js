const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('processBridge', {
  getUsername: () => ipcRenderer.invoke('getUsername'),
});