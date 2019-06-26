'use strict'

import { app, dialog, session, BrowserWindow, Menu } from 'electron'

import { bindIpcPrinter } from '../ipc/printer'
import { bindIpcDownload } from '../ipc/download'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function createWindow () {
  Menu.setApplicationMenu(null)

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (e) => {

    let ret = dialog.showMessageBox(mainWindow, { type:"warning",title: '退出确认', message:'确定退出系统吗?', buttons:['yes', 'no']})
    console.log('on close ret', ret)
    if( ret == 1){
      e.preventDefault()
      return
    }
    // remove all cookies/ logout
    session.defaultSession.clearStorageData({storages:'cookies'})
    mainWindow = null
  })
}

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('ready', function(){
  bindIpcPrinter()
  bindIpcDownload()
})


app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  console.log( "certificate-error, url=", url )
  if (url.indexOf( "jpos_api")>=0) {
    // 验证逻辑。
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
//
// import { autoUpdater } from 'electron-updater'
//
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })
//
// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

import { autoUpdater } from "electron-updater"
import log from "electron-log"

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

function sendStatusToWindow(text) {
  log.info(text);
  //win.webContents.send('message', text);
}
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production'){
    log.transports.file.level = "debug"
    autoUpdater.logger = log

    autoUpdater.checkForUpdatesAndNotify()
  }
})
