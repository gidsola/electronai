import electron from 'electron';
const { app, BrowserWindow } = electron;

app
  .on('ready', async () => await createWindow())
  // .on('before-quit', () => { console.log('before-quit'); }) // TODO: dialog for "are you sure"
  .on('window-all-closed', () => { app.quit(); }) // TODO: specific close method
  // .on('will-quit', () => { console.log('will-quit'); })
  .on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) // TODO: handle multiple instances
      await createWindow();
  });

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });
  await mainWindow.loadFile('index.html');

  // ignore cert for localhost
  mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });
};
