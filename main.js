const { app, BrowserWindow} = require('electron')
const path = require('path')

const { autoUpdater } = require("electron-updater");

const server = "https://github.com/aktest12/Gomeetify-Test.git"
autoUpdater.setFeedURL(server)

/*checking for updates*/
autoUpdater.on("checking-for-update", () => {
    console.log('check');
});

/*No updates available*/
autoUpdater.on("update-not-available", info => {
    //your code
});

/*New Update Available*/
autoUpdater.on("update-available", info => {
    //your code
});

/*Download Status Report*/
autoUpdater.on("download-progress", progressObj => {
    //your code
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", info => {
    //your code
});

/*Checking updates just after app launch and also notify for the same*/
app.on("ready", function () {
    autoUpdater.checkForUpdatesAndNotify();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            
            
        }
    })

    win.webContents.openDevTools()
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
