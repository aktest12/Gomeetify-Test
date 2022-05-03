const { ipcRenderer } = require("electron");

$('#Sign_in').click(function () {
    window.resizeTo(650, 490);
    window.location.href = 'Sign.html';
});

$('#Join_meet').click(function () {
    window.resizeTo(410, 450);
    window.location.href = 'meet.html';
});

ipcRenderer.send('checked');
ipcRenderer.on('check', function (even, val) {
    console.log(val);
})