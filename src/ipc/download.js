const {
  BrowserWindow,
  ipcMain
} = require('electron');
const {
  download
} = require('electron-dl');

export function bindIpcDownload() {

  ipcMain.on('download-file', (event, args) => {
    download(BrowserWindow.getFocusedWindow(), args.url, {saveAs: true})
      .then(dl => {
        console.log(dl.getSavePath())
        event.sender.send('download-file-done', {savedPath: dl.getSavePath()})
      })
      .catch(console.error);
  });
}
