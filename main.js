const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const { autoUpdater } = require("electron-updater");

const server = "https://github.com/aktest12/Gomeetify-Test.git"
autoUpdater.setFeedURL(server)

ipcMain.on('msg',function(event){
    /*checking for updates*/
    autoUpdater.on("checking-for-update", () => {
        console.log('check');
        event.sender.send('rev','check');
    });

    /*No updates available*/
    autoUpdater.on("update-not-available", info => {
        event.sender.send('rev',info);
    });

    /*New Update Available*/
    autoUpdater.on("update-available", info => {
        event.sender.send('rev',info);
    });

    /*Download Status Report*/
    autoUpdater.on("download-progress", progressObj => {
        event.sender.send('rev',progressObj);
    });

    /*Download Completion Message*/
    autoUpdater.on("update-downloaded", info => {
        event.sender.send('rev',info);
    });

    /* event.sender.send('rev',); */
});


Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});

/*Checking updates just after app launch and also notify for the same*/
app.on("ready", function () {
    autoUpdater.checkForUpdates();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration:true,
            enableRemoteModule: true,
            contextIsolation:false
        }
    });

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
