const {ipcRenderer} = require('electron');

ipcRenderer.send('msg');
ipcRenderer.once('rev',function(event,val){
       console.log(val);
});