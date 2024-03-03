// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require('fs');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  ipcMain.on('download', handleDownload);
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function generateRandomBinaryFile() {
  const fileSizeInBytes = Math.floor(Math.random() * 1000000 - 1000) + 1000;
  const buffer = Buffer.alloc(fileSizeInBytes);
  for (let i = 0; i < fileSizeInBytes; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  return buffer;
}

function generateRandomFileName() {
  function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for(let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const fileName = generateString(10);
  const fileExtension = generateString(3);
  return `${fileName}.${fileExtension}`;
}

function generateErrorMessage(err) {

  const goodFiles = [
    'The cure to all cancers',
    'The secret to time travel',
    'The meaning of life',
    'The best recipe for chocolate chip cookies',
    'The best joke in the world',
    'A symphony that would bring world peace',
  ]

  const randomGoodFile = goodFiles[Math.floor(Math.random() * goodFiles.length)];

  return `Error downloading the file due to this garbage: ${err}. 
  \nWhat a shame. It was the best file. It was the most beautiful file. 
  It was the most tremendous file. Believe me. It was ${randomGoodFile}!`
}

async function handleDownload(event) {
  const fileContent = generateRandomBinaryFile()
  const fileName = generateRandomFileName()
  dialog.showSaveDialog({ 
    title: 'Select the File Path to save', 
    defaultPath: path.join(__dirname, `/${fileName}`), 
    buttonLabel: 'Save', 
    }).then(file => { 
        if (!file.canceled) { 
            fs.writeFile(file.filePath.toString(), fileContent, (err) => { 
                if (err) {
                  dialog.showErrorBox('File save error', generateErrorMessage(err));
                }
            }); 
        } 
    }).catch(err => { 
        dialog.showErrorBox('File save error', generateErrorMessage(err));
    }); 
}