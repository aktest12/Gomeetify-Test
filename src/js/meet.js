const { ipcRenderer } = require("electron");

$('#cancel').click(function () {
    window.resizeTo(650, 490);
    window.location.href = 'index.html';
});

/* --BUTTON VALIDATION-- */
$(document).ready(function () {
    var checkRequired = function () {
        var allValid = false;
        $('.form-control').each(
            function () {
                if (this.value.trim() === "") {
                    allValid = true;
                    return true;
                }
            }
        );
        if (allValid == false) {
            $('#Join').removeClass('btn-outline-primary');
            $('#Join').addClass('btn-primary');
        }
        else {
            $('#Join').addClass('btn-outline-primary');
            $('#Join').removeClass('btn-primary');
        }
        $('#Join').prop('disabled', allValid);
    }
    $('.form-control').bind('keyup change blur', checkRequired);
    checkRequired();
});
/* ---BUTTON VALIDATION--- */

$('#Form-Meet').submit(function (event) {
    event.preventDefault();
    const Name = $('#Name').val();
    const Url = $('#URL').val();
    ipcRenderer.send('Hide-Main');
    ipcRenderer.send('One-Meeting', Name, Url);
});