import electron from 'electron';
import prompt from 'electron-prompt';
import { execSync } from 'child_process';
import winreg from 'winreg';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { app, BrowserWindow, ipcMain } = electron;
const __dirname = dirname(fileURLToPath(import.meta.url));

const regKey = new winreg({
  hive: winreg.HKCU,
  key: '\\Software\\ChatBotV1'
});

let USERNAME = '';

function writeToRegistry(username) {
  regKey.set('Username', winreg.REG_SZ, username, (err) => {
    if (err) {
      console.error('Error writing to registry:', err);
    } //else {
    //   console.log('Username written to registry:', username);
    // }
  });
};

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      alwaysOnTop: true,
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  await mainWindow.loadFile('assets/html/index.html');
};

app
  .on('ready', async () => {
    try {
      // extract and rename for auth key usage
      // const OS_AUTH = execSync('reg query "HKCU\\Software\\ChatBotV1" /v "OSAuth"')
      //   .toString().split('REG_SZ')[1].trim();
      USERNAME = execSync('reg query "HKCU\\Software\\ChatBotV1" /v "UserName"')
        .toString().split('REG_SZ')[1].trim();
    }
    catch (e) {
      const val = await prompt({
        title: 'Please enter a username',
        label: 'Username:',
        value: 'username',
        inputAttrs: {
          type: 'text'
        },
        type: 'input'
      });

      writeToRegistry(val);
      USERNAME = val;
    };

    await createWindow();
  })
  .on('window-all-closed', () => {
    app.quit();
  })
  .on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0)
      await createWindow();
  });

ipcMain.handle('getUsername', async () => {
  return USERNAME;
});
