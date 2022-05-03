const { ipcRenderer } = require("electron");

var token = [];
ipcRenderer.send('User_token');
ipcRenderer.once('Token-Data', function (event, val) {
    token = [];
    token.push(val.token);
});

ipcRenderer.send('child-meet');
ipcRenderer.once('meet-Data', function (event, val) {
    console.log(val);
    const domain = "meetings.netaxis.co";
    const options = {
        roomName: val.room,
        parentNode: document.querySelector('#meet'),
        configOverwrite: {},
        jwt: 'yourtokenhere',
        userInfo: {
            email: val.email,
            displayName: val.Name
        }
    }
    const api = new JitsiMeetExternalAPI(domain, options);
    api.addEventListener('readyToClose', function () {
        window.close();
    });
    const iframe = document.getElementById('jitsiConferenceFrame0');
    iframe.setAttribute('style', 'width: calc(100vw - 12px)!important; height: calc(100vh - 37px)!important;');
});