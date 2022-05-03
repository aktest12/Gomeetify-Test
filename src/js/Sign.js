const { ipcRenderer } = require("electron");

$('#back').click(function () {
    window.resizeTo(650, 490);
    window.location.href = 'index.html';
});

/* --BUTTON VALIDATION-- */
$(document).ready(function () {
    var checkRequired = function () {
        var allValid = false;
        $('.border-0').each(
            function () {
                if (this.value.trim() === "") {
                    allValid = true;
                    return true;
                }
            }
        );
        if (allValid == false) {
            $('#Log_in').removeAttr('disabled');

        }
        else {
            $('#Log_in').attr('disabled', 'disabled');
        }
    }
    $('.border-0').bind('keyup change blur', checkRequired);
    checkRequired();
});
/* ---BUTTON VALIDATION--- */

$('#Login-Form').submit(function (event) {
    event.preventDefault();
    $('#Log_in').attr('disabled', 'disabled');
    const Login_Data = {
        email: $('#Email').val(),
        password: $('#login_password').val(),
        platform: 'Desktop',
        is_meeting: true
    }
    ipcRenderer.send('Api_Data', Login_Data);
});

ipcRenderer.once('Api_Check', function (event, Check) {
    if (Check == true) {
        ipcRenderer.send('chat-window');
        window.resizeTo(screen.availWidth, screen.availHeight);
        window.location.href = 'chat.html';
    } else {
        window.location.reload();
    }
});