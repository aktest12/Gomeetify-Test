const { ipcRenderer } = require("electron");

ipcRenderer.send('Meet-DB');
ipcRenderer.once('DB-Data', function (event, val) {
    const Name = val.Name;
    const Url = val.Url.split('/')[3];
    const domain = "onemeeting.netaxis.co";
    const options = {
        roomName: Url,
        parentNode: document.querySelector('#meet'),
        configOverwrite: {},
        jwt: 'yourtokenhere',
        userInfo: {
            displayName: Name
        },
    }
    const api = new JitsiMeetExternalAPI(domain, options);
    api.addEventListener('readyToClose', function () {
        window.close();
    });
    const iframe = document.getElementById('jitsiConferenceFrame0');
    iframe.setAttribute('style', 'width: calc(100vw - 12px)!important; height: calc(100vh - 37px)!important;');
});