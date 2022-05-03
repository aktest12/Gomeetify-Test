process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app, BrowserWindow, Menu, ipcMain, powerMonitor, net, Notification } = require('electron')
const path = require('path')
const Badge = require('electron-windows-badge')
app.setAppUserModelId('Gomeetify');
Menu.setApplicationMenu(null)

const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;

autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "2sz4CaXGqMb-TS2_i5-z" };
autoUpdater.autoDownload = true;

/* autoUpdater.setFeedURL({
    provider: "generic",
    url: "http://wfh.netaxis.io:45011/mds/gomeetify_electronjs/-/tree/test"
});

ipcMain.on('checked', function (even) {

    autoUpdater.on('checking-for-update', function () {
        sendStatusToWindow('Checking for update...');
    });

    autoUpdater.on('update-available', function (info) {
        sendStatusToWindow('Update available.');
    });

    autoUpdater.on('update-not-available', function (info) {
        sendStatusToWindow('Update not available.');
    });

    autoUpdater.on('error', function (err) {
        sendStatusToWindow('Error in auto-updater.');
    });

    autoUpdater.on('download-progress', function (progressObj) {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendStatusToWindow(log_message);
    });

    autoUpdater.on('update-downloaded', function (info) {
        sendStatusToWindow('Update downloaded; will install in 1 seconds');
    });

    autoUpdater.on('update-downloaded', function (info) {
        setTimeout(function () {
            autoUpdater.quitAndInstall();
        }, 1000);
    });

    autoUpdater.checkForUpdates();
    function sendStatusToWindow(message) {
        console.log(message, 'ji');
        even.sender.send('check', message)
    }
});
 */
/* ---SCREEN LOCK--- */
const isDev = require('electron-is-dev');
let store;

if (isDev) {
    store = path.join(app.getAppPath(), 'lib', 'store');
} else {
    store = path.join(app.getAppPath(), '..', '..', 'resources', 'app.asar.unpacked', 'lib', 'store');
}

const connect = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: store
    },
    useNullAsDefault: true
});

ipcMain.on('User_Login', function (event) {
    const Login_User = connect.raw('select * from UserDetails');
    Login_User.then(LogValue => {
        LogValue.map(values => {
            const User_data = JSON.parse(values.Data);
            event.sender.send('User-Data', User_data);
        });
    });
});
/* --- DATABASE SERVICES --- */

ipcMain.on('User_token', function (event) {
    const User_token = connect.raw('select * from Token');
    User_token.then(TokenValue => {
        TokenValue.map(values => {
            event.sender.send('Token-Data', values);
        });
    });
});

var win;
function createWindow() {
    win = new BrowserWindow({
        icon: 'assets/icon4.ico',
        width: 650,
        height: 490,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(win.webContents)
    /* ELECTRON BADGE ICON */
    const badgeOptions = {}
    new Badge(win, badgeOptions);
    /* --ELECTRON BADGE ICON-- */

    win.loadFile('src/views/index.html')
    win.webContents.openDevTools()

    ipcMain.on('chat-window', function (event) {
        win.resizable = true;
        win.center();
    });

    ipcMain.on('Sign-window', function (event) {
        win.resizable = false;
        win.center();
    });

    ipcMain.on('Hide-Main', function (event) {
        win.hide();
    });

}

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

/* JOIN A MEETING */
function createChildWindow() {
    const childWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: 'assets/icon4.ico',
        modal: true,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    childWindow.loadFile('src/views/Onemeet.html');
    //   childWindow.webContents.openDevTools();
    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });

    childWindow.on('closed', function () {
        win.show();
    });

}

ipcMain.on('One-Meeting', function (event, Name, Url) {
    const Data = {
        Name: Name,
        Url: Url
    }
    connect('Meet').where('id', 1).update(Data).catch((err) => { console.log("LOGIN NOT UPDATEING", err) });
    createChildWindow();
});

ipcMain.on('Meet-DB', function (event) {
    const User_DB = connect.raw('select * from Meet');
    User_DB.then(values => {
        event.sender.send('DB-Data', values[0]);
    });
});
/* JOIN A MEETING */

/* MEETING WINDOW */
function MeetingWindow() {
    const childWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: 'assets/icon4.ico',
        modal: true,
        show: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    childWindow.loadFile('src/views/meetings.html');
    childWindow.webContents.openDevTools();
    childWindow.once("ready-to-show", () => {
        childWindow.show();
    });

    childWindow.on('closed', function () {
        win.show();
    });

}
ipcMain.on('child', function (event, Room, userID) {
    const Data = {
        room: Room,
        email: userID.email,
        Name: userID.name
    }
    connect('Meetings').where('id', 1).update(Data).catch((err) => { console.log("LOGIN NOT UPDATEING", err) });
    MeetingWindow();
});

ipcMain.on('child-meet', function (event) {
    const User_DB = connect.raw('select * from Meetings');
    User_DB.then(values => {
        values.map(val => {
            event.sender.send('meet-Data', val);
        });
    });
});
/* MEETING WINDOW */

/* ---SCREEN LOCK--- */
ipcMain.on('screen-lock', function (event) {
    powerMonitor.addListener('lock-screen', () => {
        const lock = 'locked'
        event.sender.send('lock-screen', lock);
    });
});

ipcMain.on('screen-unlock', function (event) {
    powerMonitor.addListener('unlock-screen', () => {
        const unlock = 'unlocked'
        event.sender.send('unlock-screen', unlock);
    });
});
/* --- SCREEN LOCK EVENT --- */

/* MESSAGE NOTIFICATION */
ipcMain.on('Notification', function (event, who, message) {
    const options = {
        title: who,
        body: message,
        silent: false,
        sound: true,
        timeout: 200,
        wait: false,
        icon: path.join(__dirname, 'assets/icon1.ico')
    }
    const customNotification = new Notification(options);
    customNotification.show();
});
/* --MESSAGE NOTIFICATION-- */

/* --- API CALL --- */
var token = [];
ipcMain.on('Api_Data', function (event, Login_Data) {

    function auto_token() {
        const body = JSON.stringify(Login_Data);
        const request = net.request({
            method: 'POST',
            protocol: 'https:',
            hostname: 'gomeetify.revyy.com',
            path: '/api/app/login',
            redirect: 'follow',
        });

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                try {
                    const Token = JSON.parse(`${chunk}`);
                    if (Token.success === true) {
                        token = [];
                        token.push(Token.meeting_token);
                        const Data = {
                            token: Token.meeting_token
                        }
                        connect('Token').where('id', 1).update(Data).catch((err) => { console.log("TOKEN NOT UPDATEING", err) });
                    } else {
                        event.sender.send('Api_Check', false);
                        console.log('Failed-login');
                    }
                } catch {
                    event.sender.send('Api_Check', false);
                    console.log('login-error');
                }
            });
        });

        request.setHeader('Content-Type', 'application/json');
        request.write(body, 'utf-8');
        request.end();
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(token)
            }, 1000)
        });
    }

    (async () => {
        const result = await auto_token();
        console.log(result);
        if (result[0] != undefined) {
            const body = JSON.stringify({ token: result[0] });
            const request = net.request({
                method: 'GET',
                protocol: 'https:',
                hostname: 'app.gomeetify.revyy.com',
                path: 'user-details-api',
                redirect: 'follow',
            });
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    try {
                        const Data = JSON.parse(`${chunk}`);
                        const check = Data.userDetails.authUser.jid;
                        const User = {
                            Data: JSON.stringify(Data)
                        }
                        connect('UserDetails').where('id', 1).update(User).catch((err) => { console.log("LOGIN NOT UPDATEING", err) });
                        if (check != '' && check != undefined) {
                            event.sender.send('Api_Check', true);
                        }
                    } catch {
                        console.log('err');
                        event.sender.send('Api_Check', false);
                    }
                });
            });
            request.setHeader('Content-Type', 'application/json');
            request.write(body, 'utf-8');
            request.end();
        }
    })();
});
/* --- API CALL END --- */

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