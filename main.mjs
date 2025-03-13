import electron from 'electron';
import prompt from 'electron-prompt';
import { execSync } from 'child_process';
import winreg from 'winreg';

const { app, BrowserWindow, ipcMain } = electron;

let USERNAME = '';

app
  .on('ready', async () => {
    try {

      USERNAME = execSync('reg query "HKCU\\Software\\ChatBotV1" /v "UserName"')
        .toString().split('REG_SZ')[1].trim();
    
    } catch (e) {
      // console.error("Error in MAIN:", e);
      const val = await prompt({
        title: 'Please enter a username',
        label: 'Username:',
        value: 'username',
        inputAttrs: {
          type: 'text'
        },
        type: 'input'
      });
      // console.log("prompt value", val);
      writeToRegistry(val);
      USERNAME = val;
    };

    await createWindow();

  })
  .on("when-ready", async () => {
    await createWindow();
  })
  .on('window-all-closed', () => { // TODO: specific close method
    app.quit();
  })
  .on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) // TODO: handle multiple instances? -- maybe.
      await createWindow();
  });
// .on('before-quit', () => { console.log('before-quit'); }) // TODO: dialog for "are you sure"
// .on('will-quit', () => { console.log('will-quit'); })

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: 'D:/GitHub/electronai/preload.js',
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });
  await mainWindow.loadFile('assets/html/index.html');

  // ignore cert for localhost
  // mainWindow.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
  //   event.preventDefault();
  //   callback(true);
  // });
};

function writeToRegistry(username) {
  const regKey = new winreg({
    hive: winreg.HKCU,
    key: '\\Software\\ChatBotV1'
  });

  regKey.set('Username', winreg.REG_SZ, username, (err) => {
    if (err) {
      console.error('Error writing to registry:', err);
    } else {
      console.log('Username written to registry:', username);
    }
  });

};

ipcMain.handle('getUsername', async () => {
  return USERNAME;
});
