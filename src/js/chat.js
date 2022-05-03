let val = false;
$('#loginDropdownParent').on('click', function () {
    if (val == true) {
        $('#loginDropdown').hide();
        val = false;
    } else {
        val = true;
        $('#loginDropdown').show();
    }
});

/* setInterval(() => {
    window.location.reload();
}, 50000); */

$(document).ready(function () {
    $('#main').css('display', 'none');
});

$('#asideMenuEle').click(function () {
    $('#contactRequestModal').show();
});

$('#close').click(function () {
    $('#contactRequestModal').hide();
});

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

const { ipcRenderer } = require("electron");
const mouseEvents = require("global-mouse-events");
const dayjs = require('dayjs');

/* var token = [];
ipcRenderer.send('User_token');
ipcRenderer.once('Token-Data', function (event, val) {
    token = [];
    token.push(val.token);
}); */

const { dialog, BrowserWindow } = require('@electron/remote');
const wind = BrowserWindow.getFocusedWindow();
/* dialog.showMessageBox(wind, {
    title: 'Application is not responding',
    buttons: ['Accept', 'Decline'],
    type: 'question',
    message: 'Application is not responding…',
}); */

ipcRenderer.send('User_Login');
ipcRenderer.once('User-Data', function (event, User_data) {
    const client = {};
    client.jid = "jdify_" + User_data.userDetails.authUser.active_workspace_id + '_' + User_data.userDetails.authUser.id + '@mongoose.netaxis.co';
    const AllUserName = JSON.parse(User_data.allUsers);
    const AllUser = JSON.parse(User_data.allUsers);

    /* USER PROFILE SET */
    if (User_data.userDetails.authUser.profile_image != null) {
        $('#loginDropdownParent').find('img.projectIcon').attr('src', User_data.userDetails.authUser.profile_image);
    } else {
        $('#loginDropdownParent').find('img.projectIcon').attr('src', `../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg`);
    }
    /* --USER PROFILE SET-- */

    converse.initialize({
        bosh_service_url: 'https://mongoose.netaxis.co:447/http-bind/',
        authentication: 'login',
        whitelisted_plugins: ['Contact-Fetch', 'chat', 'Contact-Request'],
        //debug: true,
        auto_login: true,
        jid: client.jid,
        password: "Meeting@123",
        message_archiving_timeout: 2000,
        message_archiving: undefined,
        archived_messages_page_size: 100,
        muc_clear_messages_on_leave: false,
        auto_join_rooms: User_data.userRooms.map(r => r.room_id),
        nickname: User_data.userDetails.authUser.name,
        notify_all_room_messages: true,
        muc_fetch_members: ['member', 'owner', 'moderator'],
        send_chat_state_notifications: true
    });

    converse.plugins.add('Contact-Fetch', {
        initialize: function () {
            const { _converse } = this;
            /* USER CONTACT LISTED */
            _converse.api.listen.on('rosterContactsFetched', function () {
                const contacts = _converse.api.contacts.get();
                $('#contactRoster').empty();
                contacts.forEach(el => {
                    if (el.attributes.subscription == "both") {
                        const jid = el.attributes.jid.split('@')[0].split('_')[2];
                        AllUserName.find(user => {
                            if (user.id == jid) {
                                if (user.profile_image != null) {
                                    if (el.presence.attributes.show == 'online') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                         <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                         <figure><img src="${user.profile_image}" class="contactIcon"></figure>
                                         <figure class="d-flex"><img src="../svg/online.svg" class="status online"> </figure> </div>
                                         <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                         <figure class="ml-auto cursor-pointer pr-12px favIcon">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                         </figure>
                                         </span>
                                        </div>`);
                                    } else if (el.presence.attributes.show == 'away') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                          <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                          <figure><img src="${user.profile_image}" class="contactIcon"></figure>
                                          <figure class="d-flex"><img src="../svg/away.svg" class="status online"> </figure> </div>
                                          <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                          <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                          <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                          </figure>
                                          </span>
                                         </div>`);
                                    } else if (el.presence.attributes.show == 'dnd') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                         <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                         <figure><img src="${user.profile_image}" class="contactIcon"></figure>
                                         <figure class="d-flex"><img src="../svg/dnd.svg" class="status online"> </figure> </div>
                                         <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                         <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                         </figure>
                                         </span>
                                        </div>`);
                                    }
                                    else {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                         <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                         <figure><img src="${user.profile_image}" class="contactIcon"></figure>
                                         <figure class="d-flex"><img src="../svg/away.svg" class="status online"> </figure> </div>
                                         <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                         <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                         </figure>
                                         </span>
                                        </div>`);
                                    }
                                } else {
                                    if (el.presence.attributes.show == 'online') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                          <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                          <figure><img src="../svg/profile_icon/${user.name.charAt(0).toLowerCase()}.svg" class="contactIcon"></figure>
                                          <figure class="d-flex"><img src="../svg/online.svg" class="status online"> </figure> </div>
                                          <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                          <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                           <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                          </figure>
                                          </span>
                                           </div>`);
                                    } else if (el.presence.attributes.show == 'away') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                          <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                          <figure><img src="../svg/profile_icon/${user.name.charAt(0).toLowerCase()}.svg" class="contactIcon"></figure>
                                          <figure class="d-flex"><img src="../svg/away.svg" class="status online"> </figure> </div>
                                          <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                          <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                          </figure>
                                          </span>
                                           </div>`);
                                    } else if (el.presence.attributes.show == 'dnd') {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                          <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                          <figure><img src="../svg/profile_icon/${user.name.charAt(0).toLowerCase()}.svg" class="contactIcon"></figure>
                                          <figure class="d-flex"><img src="../svg/dnd.svg" class="status online"> </figure> </div>
                                          <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                          <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                          <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                          </figure>
                                          </span>
                                         </div>`);
                                    }
                                    else {
                                        $('#contactRoster').append(`<div class="contact contactBlock">
                                         <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                         <figure><img src="../svg/profile_icon/${user.name.charAt(0).toLowerCase()}.svg" class="contactIcon"></figure>
                                         <figure class="d-flex"><img src="../svg/away.svg" class="status online"> </figure> </div>
                                         <button value="${el.id}" class="contactName">${user.name}</button><span class="d-flex ml-auto align-items-center">
                                         <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                          <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                          </g>
                                          </svg>
                                         </figure>
                                         </span>
                                        </div>`);
                                    }
                                }
                            }
                        })
                    }
                });
            });
            /* --USER CONTACT LISTED-- */

            /* MOUSE EVENT */
            var timeout;
            mouseEvents.on("mousemove", even => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    const status = _converse.xmppstatus.get('status');
                    if (status == 'online') {
                        $('#loginDropdownParent').find('img.status.online.cursor-pointer.loginIconImg').attr('src', '../svg/away.svg');
                        _converse.api.user.status.set('away');
                    }
                }, 100000);
            });
            /* MOUSE EVENT */

            /* USER PRESENCE CHAGER */
            _converse.api.listen.on('contactPresenceChanged', from => {
                $('.contact.contactBlock button').each(function (index) {
                    const checking = $(this).val();
                    if (checking == from.id) {
                        if (from.presence.attributes.show == 'online') {
                            $('.contact.contactBlock img.status.online').eq(index).attr('src', '../svg/online.svg');
                        } else if (from.presence.attributes.show == 'away') {
                            $('.contact.contactBlock img.status.online').eq(index).attr('src', '../svg/away.svg');
                        } else if (from.presence.attributes.show == 'dnd') {
                            $('.contact.contactBlock img.status.online').eq(index).attr('src', '../svg/dnd.svg');
                        } else {
                            $('.contact.contactBlock img.status.online').eq(index).attr('src', '../svg/away.svg');
                        }
                    }
                });
            });
            /* --USER PRESENCE CHAGER-- */

            /* USER MUC GROUP */
            User_data.userRooms.forEach(Rooms => {
                _converse.api.rooms.open(Rooms.room_id, {
                    'nick': User_data.userDetails.authUser.name, 'auto_configure': true, 'name': Rooms.name,
                    'description': 'group chat for discussion',
                    'roomconfig': {
                        'changesubject': false,
                        'membersonly': true,
                        'persistentroom': true,
                        'publicroom': true,
                        'roomdesc': 'new group for checking',
                        'whois': 'anyone',
                        'open': true,
                        'public_list': true,
                        'getmemberlist': ['visitor']
                    }
                }).then((GroupData) => {
                    GroupData.attributes.name = Rooms.name;
                    GroupData.join(client.jid.split('@')[0]);
                    $('#GroupRoster').append(`<div class="contact contactBlock">
                                         <div class="justify-content-center align-items-center d-flex w-30px h-30px ml-5">
                                         <span class=" p-5px ">                                          
                                         <img class="icon icon-13 lock" src="../svg/lock.svg">
                                         </span></div>
                                         <button value="${GroupData.id}" class="contactName">${GroupData.attributes.name}</button><span class="d-flex ml-auto align-items-center">
                                         <figure class="ml-auto cursor-pointer pr-12px favIcon ">
                                         <svg class="icon icon iconSm" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                         <g id="Layer_1" data-name="Layer 1"> <path d="M27.4435,34.21236a1.40778,1.40778,0,0,1-.82908-.27033l-9.11435-6.62194-9.11444,6.622a1.41052,1.41052,0,0,1-2.17056-1.577L9.69644,21.65045.582,15.02841a1.41044,1.41044,0,0,1,.82909-2.55153H12.67713L16.1586,1.76225a1.41051,1.41051,0,0,1,2.68294-.0001v.0001l3.48137,10.71463H33.589a1.41049,1.41049,0,0,1,.829,2.55163l-9.11434,6.62194,3.48146,10.71472a1.41183,1.41183,0,0,1-1.34157,1.84719ZM3.07192,14.427l8.34392,6.06223a.97493.97493,0,0,1,.35422,1.09009l-3.18714,9.809,8.344-6.06223a.97494.97494,0,0,1,1.14627,0l8.34392,6.06223L23.23,21.57932a.97494.97494,0,0,1,.35422-1.09009L31.92812,14.427H21.61447a.97517.97517,0,0,1-.92736-.67378l-3.187-9.80889-3.18714,9.80889a.97516.97516,0,0,1-.92735.67378Z" />
                                         </g>
                                         </svg>
                                         </figure>
                                         </span>
                                        </div>`);
                });
            });
            /* --USER MUC GROUP-- */
        }
    });

    converse.plugins.add('chat', {
        initialize: function () {
            const { _converse } = this;
            /* CONNECTION CHECKER */
            _converse.api.listen.on('connected', () => {
                console.log("connected");
            });
            /* --CONNECTION CHECKER-- */

            /* ONE TO ONE MAM  */
            $(document).ready(function () {
                setTimeout(() => {
                    $("#contactRoster .contact.contactBlock").on('click', function () {
                        $('#RequestContact').hide();
                        ipcRenderer.sendSync('update-badge', null);
                        $(".contact.contactBlock").removeClass("active");
                        $(this).addClass("active");
                        $("#main").show();
                        $('#Chat_Message').empty();
                        $("#ChatView").show();
                        $("#GroupView").hide();
                        GetMessage('else');
                        let iq = window.converse.env.$iq({
                            type: 'get',
                            from: client.jid,
                            to: $(this).find('button').val()
                        }).c('query', { xmlns: 'jabber:iq:last' });
                        _converse.api.sendIQ(iq);
                    });
                }, 1000);

                $("#ChatView").on('click', function () {
                    GetMessage('if');
                });
            });

            var latestRSM = [];
            function GetMessage(condition) {
                const MamJid = $("#contactRoster .contact.contactBlock.active").find('button').val();
                if (condition == 'if') {
                    var opt = {
                        'with': MamJid,
                        'max': 50,
                        'before': ''
                    };
                    options = Object.assign(opt, latestRSM[0].previous(50));
                    latestRSM = [];
                    _converse.api.archive.query(options, function (messages, rsm, complete) {
                        latestRSM.push(rsm);
                        if (rsm.index == 0) {
                            $("#ChatView").hide();
                        }
                        messages.reverse().forEach((msg, index, array) => {
                            const body = $(msg).find("forwarded message body").text();
                            const stamp = $(msg).find("forwarded delay").attr("stamp");
                            const from = $(msg).find("forwarded message").attr("from").split('/')[0];
                            const day = new Date(stamp);
                            const currentDay = new Date();
                            const yesterDay = new Date(new Date().setDate(new Date().getDate() - 1));
                            var MessageDate;
                            if (dayjs(day).format('D-MM-YYYY') == dayjs(currentDay).format('D-MM-YYYY')) {
                                MessageDate = dayjs(day).format("hh:mm A");
                            } else if (dayjs(day).format('D-MM-YYYY') == dayjs(yesterDay).format('D-MM-YYYY')) {
                                MessageDate = 'Yesterday' + ', ' + dayjs(day).format("hh:mm A");
                            } else {
                                MessageDate = dayjs(day).format('MMM DD, hh:mm A');
                            }
                            if (body != '') {
                                if (from == MamJid) {
                                    const fromName = $("#contactRoster .contact.contactBlock.active").find('button').text();
                                    const img = $("#contactRoster .contact.contactBlock.active").find('.contactIcon').attr('src');
                                    $('#Chat_Message').prepend(`<div class="msg d-flex mb-20px">
                                     <img class="msgImageIcon" src="${img}">
                                     <div class="textBox">
                                     <div class="font-12">
                                     <span>${fromName}</span>
                                     <span class="ml-5px">${MessageDate}</span></div>
                                     <div class="d-flex mb-20px">
                                     <div class="senderText">
                                     <span class="msgBox">${body}</span></div></div></div></div>`);
                                } else {
                                    $('#Chat_Message').prepend(`<div class="msg d-flex mb-20px">
                                     <img class="msgImageIcon" src="../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg">
                                     <div class="textBox">
                                     <div class="font-12">
                                     <span>You</span>
                                     <span class="ml-5px">${MessageDate}</span></div>
                                     <div class="d-flex mb-20px">
                                     <div class="senderText">
                                     <span class="msgBox">${body}</span></div></div></div></div>`);
                                }
                            }
                        });
                    });
                }
                else {
                    var options = {
                        'with': MamJid,
                        'max': 15,
                        'before': ''
                    }
                    latestRSM = [];
                    _converse.api.archive.query(options, function (messages, rsm, complete) {
                        latestRSM.push(rsm);
                        if (rsm.index == 0) {
                            $("#ChatView").hide();
                        }
                        messages.forEach((msg) => {
                            const body = $(msg).find("forwarded message body").text();
                            const stamp = $(msg).find("forwarded delay").attr("stamp");
                            const from = $(msg).find("forwarded message").attr("from").split('/')[0];
                            const day = new Date(stamp);
                            const currentDay = new Date();
                            const yesterDay = new Date(new Date().setDate(new Date().getDate() - 1));
                            var MessageDate;
                            if (dayjs(day).format('D-MM-YYYY') == dayjs(currentDay).format('D-MM-YYYY')) {
                                MessageDate = dayjs(day).format("hh:mm A");
                            } else if (dayjs(day).format('D-MM-YYYY') == dayjs(yesterDay).format('D-MM-YYYY')) {
                                MessageDate = 'Yesterday' + ', ' + dayjs(day).format("hh:mm A");
                            } else {
                                MessageDate = dayjs(day).format('MMM DD, hh:mm A');
                            }
                            if (body != '') {
                                if (from == MamJid) {
                                    const fromName = $("#contactRoster .contact.contactBlock.active").find('button').text();
                                    const img = $("#contactRoster .contact.contactBlock.active").find('.contactIcon').attr('src');
                                    $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                                     <img class="msgImageIcon" src="${img}">
                                     <div class="textBox">
                                     <div class="font-12">
                                     <span>${fromName}</span>
                                     <span class="ml-5px">${MessageDate}</span></div>
                                     <div class="d-flex mb-20px">
                                     <div class="senderText">
                                     <span class="msgBox">${body}</span></div></div></div></div>`);
                                } else {
                                    $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                                     <img class="msgImageIcon" src="../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg">
                                     <div class="textBox">
                                     <div class="font-12">
                                     <span>You</span>
                                     <span class="ml-5px">${MessageDate}</span></div>
                                     <div class="d-flex mb-20px">
                                     <div class="senderText">
                                     <span class="msgBox">${body}</span></div></div></div></div>`);
                                }
                            }
                        });
                    });
                }
            }
            /* --ONE TO ONE MAM-- */

            /* GROUP MESSAGE MAM */
            $(document).ready(function () {
                setTimeout(() => {
                    $("#GroupRoster .contact.contactBlock").on('click', function () {
                        $('#RequestContact').hide();
                        ipcRenderer.sendSync('update-badge', null);
                        $(".contact.contactBlock").removeClass("active");
                        $(this).addClass("active");
                        $('#Chat_Message').empty();
                        $("#main").show();
                        $("#ChatView").hide();
                        $("#GroupView").show();
                        GroupChat('else');
                        $('.contactNameTopNav').text($("#GroupRoster .contact.contactBlock.active").find('button').text());
                        $('#showLastSeen').hide();
                        $('#GroupImg').hide();
                    });
                }, 1000);

                $("#GroupView").on('click', function () {
                    GroupChat('if');
                });
            });

            var latestRSM = [];
            function GroupChat(condition) {
                const MamJid = $("#GroupRoster .contact.contactBlock.active").find('button').val();
                if (condition == 'if') {
                    var opt = {
                        'with': MamJid,
                        'max': 50,
                        'before': '',
                        'groupchat': true
                    };
                    options = Object.assign(opt, latestRSM[0].previous(50));
                    latestRSM = [];
                    _converse.api.archive.query(options, function (messages, rsm, complete) {
                        latestRSM.push(rsm);
                        if (rsm.index == 0) {
                            $("#GroupView").hide();
                        }
                        messages.reverse().forEach(msg => {
                            const body = $(msg).find("forwarded message body").text();
                            const stamp = $(msg).find("forwarded delay").attr("stamp");
                            var sender = $(msg).find("forwarded message").attr("from").split('/')[1];
                            const from = sender.split('_')[2];
                            const day = new Date(stamp);
                            const currentDay = new Date();
                            const yesterDay = new Date(new Date().setDate(new Date().getDate() - 1));
                            var MessageDate;
                            if (dayjs(day).format('D-MM-YYYY') == dayjs(currentDay).format('D-MM-YYYY')) {
                                MessageDate = dayjs(day).format("hh:mm A");
                            } else if (dayjs(day).format('D-MM-YYYY') == dayjs(yesterDay).format('D-MM-YYYY')) {
                                MessageDate = 'Yesterday' + ', ' + dayjs(day).format("hh:mm A");
                            } else {
                                MessageDate = dayjs(day).format('MMM DD, hh:mm A');
                            }
                            if (body != '') {
                                AllUserName.map(check => {
                                    if (check.id == from) {
                                        if (check.profile_image != null) {
                                            $('#Chat_Message').prepend(`<div class="msg d-flex mb-20px">
                                         <img class="msgImageIcon" src="${check.profile_image}">
                                         <div class="textBox">
                                         <div class="font-12">
                                         <span>${check.name}</span>
                                         <span class="ml-5px">${MessageDate}</span></div>
                                         <div class="d-flex mb-20px">
                                         <div class="senderText">
                                         <span class="msgBox">${body}</span></div></div></div></div>`);
                                        } else {
                                            $('#Chat_Message').prepend(`<div class="msg d-flex mb-20px">
                                          <img class="msgImageIcon" src='../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg'>
                                         <div class="textBox">
                                         <div class="font-12">
                                         <span>${check.name}</span>
                                         <span class="ml-5px">${MessageDate}</span></div>
                                         <div class="d-flex mb-20px">
                                         <div class="senderText">
                                         <span class="msgBox">${body}</span></div></div></div></div>`);
                                        }
                                    }
                                })
                            }
                        });
                    });
                }
                else {
                    var options = {
                        'with': MamJid,
                        'max': 50,
                        'before': '',
                        'groupchat': true
                    }
                    latestRSM = [];
                    _converse.api.archive.query(options, function (messages, rsm, complete) {
                        latestRSM.push(rsm);
                        if (rsm.index == 0) {
                            $("#GroupView").hide();
                        }
                        messages.forEach(msg => {
                            const body = $(msg).find("forwarded message body").text();
                            const stamp = $(msg).find("forwarded delay").attr("stamp");
                            var sender = $(msg).find("forwarded message").attr("from").split('/')[1];
                            const from = sender.split('_')[2];
                            const day = new Date(stamp);
                            const currentDay = new Date();
                            const yesterDay = new Date(new Date().setDate(new Date().getDate() - 1));
                            var MessageDate;
                            if (dayjs(day).format('D-MM-YYYY') == dayjs(currentDay).format('D-MM-YYYY')) {
                                MessageDate = dayjs(day).format("hh:mm A");
                            } else if (dayjs(day).format('D-MM-YYYY') == dayjs(yesterDay).format('D-MM-YYYY')) {
                                MessageDate = 'Yesterday' + ', ' + dayjs(day).format("hh:mm A");
                            } else {
                                MessageDate = dayjs(day).format('MMM DD, hh:mm A');
                            }
                            if (body != '') {
                                AllUserName.map(check => {
                                    if (check.id == from) {
                                        if (check.profile_image != null) {
                                            $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                                         <img class="msgImageIcon" src="${check.profile_image}">
                                         <div class="textBox">
                                         <div class="font-12">
                                         <span>${check.name}</span>
                                         <span class="ml-5px">${MessageDate}</span></div>
                                         <div class="d-flex mb-20px">
                                         <div class="senderText">
                                         <span class="msgBox">${body}</span></div></div></div></div>`);
                                        } else {
                                            $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                                            <img class="msgImageIcon" src="../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg">
                                            <div class="textBox">
                                            <div class="font-12">
                                            <span>${check.name}</span>
                                            <span class="ml-5px">${MessageDate}</span></div>
                                            <div class="d-flex mb-20px">
                                            <div class="senderText">
                                            <span class="msgBox">${body}</span></div></div></div></div>`);
                                        }
                                    }
                                })
                            }
                        });
                    });
                }
            }
            /* --GROUP MESSAGE MAM-- */

            /* ONE TO ONE AND GROUP MESSAGE SEND */
            $('#SendMessage').click(function (event) {
                event.preventDefault();
                const value = $("#contactRoster .contact.contactBlock.active").find('button').val();
                client.Group_jid = $("#GroupRoster .contact.contactBlock.active").find('button').val();
                client.User_jid = value;
                if (value == undefined) {
                    const GroupMessage = window.converse.env.$msg({
                        to: client.Group_jid,
                        from: client.jid,
                        type: 'groupchat'
                    }).c("body").t($('#TypedMessage').val());
                    _converse.api.send(GroupMessage);
                } else {
                    const OneMessage = window.converse.env.$msg({
                        to: client.User_jid,
                        from: client.jid,
                        type: 'chat'
                    }).c("body").t($('#TypedMessage').val());
                    _converse.api.send(OneMessage);
                }
                newMessage();
            });

            function newMessage() {
                const message = $("#TypedMessage").val();
                const currentDay = new Date();
                const MessageDate = dayjs(currentDay).format("hh:mm A");
                if (message != '') {
                    $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                         <img class="msgImageIcon" src="../svg/profile_icon/${User_data.userDetails.authUser.name.charAt(0).toLowerCase()}.svg">
                         <div class="textBox">
                         <div class="font-12">
                         <span>${'You'}</span>
                         <span class="ml-5px">${MessageDate}</span></div>
                         <div class="d-flex mb-20px">
                         <div class="senderText">
                         <span class="msgBox">${message}</span></div></div></div></div>`);
                    $('#TypedMessage').val(null);
                }
                $("#Chat_Message").animate({ scrollTop: $(document).height() }, "fast");
            };
            /* --ONE TO ONE AND GROUP MESSAGE SEND-- */

            /* LAST SEEN GET */
            client.showLastSeen = (seconds) => {
                var lastTime;
                if (seconds && seconds != "0") {
                    let fullDay = "";
                    let dateFormat = "";
                    let yearFormat = "";
                    let timeFormat = "hh:mm A";
                    let currenDate = new Date();
                    let lastSeenDate = new Date(Date.now() - seconds * 1000);
                    let currentYear = dayjs(currenDate).year();
                    if (dayjs(lastSeenDate).year() != currentYear) {
                        yearFormat = "YYYY, ";
                    }
                    let first = currenDate.getDate() - currenDate.getDay();
                    let firstdayOfThisWeek = new Date(currenDate.setDate(first));
                    if (firstdayOfThisWeek <= lastSeenDate) {
                        var diffDays = lastSeenDate.getDate() - new Date().getDate();
                        if (diffDays == 0) {
                            fullDay = "today at ";
                        } else if (diffDays == -1) {
                            fullDay = "yesterday at ";
                        } else {
                            dateFormat = "ddd, ";
                        }
                    } else {
                        dateFormat = "MMM DD, ";
                    }
                    let formatString = dateFormat + yearFormat + timeFormat;
                    lastTime = "Last seen " + fullDay + dayjs(lastSeenDate).format(formatString);
                    $('.contactNameTopNav').text($("#contactRoster .contact.contactBlock.active").find('button').text());
                    $('#showLastSeen').text(lastTime).show();
                    $('#lastImg').attr('src', '../svg/away.svg');
                    $('#GroupImg').show();
                } else if (seconds == "0") {
                    lastTime = "Active now";
                    $('.contactNameTopNav').text($("#contactRoster .contact.contactBlock.active").find('button').text());
                    $('#showLastSeen').text(lastTime).show();
                    $('#lastImg').attr('src', '../svg/online.svg');
                    $('#GroupImg').show();
                }
            }

            _converse.api.listen.on('connectionInitialized', () => {
                _converse.connection.xmlInput = function (msg) {
                    let type = $(msg).find("message").attr('type');
                    //console.log(msg);
                    /* LAST SEEN */
                    if ($(msg).find('iq query').attr('seconds')) {
                        let seconds = $(msg).find('iq query').attr('seconds');
                        client.showLastSeen(seconds);
                    }
                    /* --LAST SEEN-- */

                    /* GROUP CHAT RECEVIER */
                    if ($(msg).find('message').length && $(msg).find("message").attr('type') == 'groupchat') {
                        $(msg).find('message').each((ind, item) => {
                            if ($(item).find("body").text() != '') {
                                const body = $(item).find("body").text();
                                let type = $(item).find('received').length ? "received" : "displayed";
                                let roomId = $(item).attr('from').split('/')[0];
                                let markFrom = $(item).attr('from').split('/')[1];
                                let receivedId = $(item).find(type).attr('id');
                                var room = User_data.userRooms.find((r) => {
                                    return r.room_id == roomId;
                                });
                                if (markFrom.split('_')[2] != client.jid.split('@')[0].split('_')[2]) {
                                    const id = $("#GroupRoster .contact.contactBlock.active").find('button').text();
                                    if (room.name != id && id != '') {
                                        const text = body.replace(/<(?:.|\n)*?>/gm, '');
                                        ipcRenderer.send('Notification', room.name, text);
                                        ipcRenderer.sendSync('update-badge', 1);
                                    }
                                }
                            }
                        });
                    }
                    /* --GROUP CHAT RECEVIER-- */

                    if (type == "chat") {
                        const body = $(msg).find("body").text();
                        const status = _converse.xmppstatus.get('status');
                        if ($(msg).find('data').attr('action') == 'call' && body == 'Incomming call') {
                            if (status == "offline") {

                            } else {
                                var room = $(msg).find('data').attr('url');
                                const from = $(msg).find('message').attr('from').split('@')[0].split('_')[2];
                                AllUserName.map(jid => {
                                    if (from == jid.id) {
                                        dialog.showMessageBox(wind, {
                                            title: 'Incoming call',
                                            buttons: ['Accept', 'Decline'],
                                            type: 'question',
                                            message: jid.name,
                                        }).then(result => {
                                            if (result.response === 0) {
                                                console.log('acc');
                                                //console.log(token);
                                                window.open(room, "Meeting", "height=500,width=300");
                                            } else {

                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }

                }
            });
            /* --LAST SEEN GET-- */

            /* MESSAGE RECEIVER */
            _converse.api.listen.on('message', (mes) => {
                const messageFrom = $(mes)[0].stanza.attributes.from.textContent;
                const newMessage = $(mes)[0].stanza.textContent;
                const from = messageFrom.split('@')[0].split('_')[2];
                AllUserName.map(check => {
                    if (check.id == from) {
                        if (newMessage != '') {
                            const val = $("#contactRoster .contact.contactBlock.active").find('button').text();
                            if (val == check.name) {
                                $('#Chat_Message').append(`<div class="msg d-flex mb-20px">
                              <img class="msgImageIcon" src="../svg/profile_icon/${check.name.charAt(0).toLowerCase()}.svg">
                              <div class="textBox">
                              <div class="font-12">
                              <span>${check.name}</span>
                              <span class="ml-5px">Apr 08</span></div>
                              <div class="d-flex mb-20px">
                              <div class="senderText">
                              <span class="msgBox">${newMessage}</span></div></div></div></div>`);
                            }
                            if (val != check.name) {
                                const text = newMessage.replace(/<(?:.|\n)*?>/gm, '');
                                ipcRenderer.send('Notification', check.name, text);
                                ipcRenderer.sendSync('update-badge', 1);
                            }
                        } else {
                            $('#Chat_type').append(`<span>${check.name} typeing</span>`).delay(2000).slideUp(300);
                        }
                    }
                });
            });
            /* --MESSAGE RECEIVER-- */
        }
    });

    converse.plugins.add('Contact-Request', {
        initialize: function () {
            const { _converse } = this;

            /* ONLINE STATUS CHANGE */
            $('#Status-Online').click(function () {
                _converse.api.user.status.set('online');
                $('#loginDropdownParent').find('img.status.online.cursor-pointer.loginIconImg').attr('src', '../svg/online.svg');
            });
            $('#Status-away').click(function () {
                _converse.api.user.status.set('away');
                $('#loginDropdownParent').find('img.status.online.cursor-pointer.loginIconImg').attr('src', '../svg/away.svg');
            });
            $('#Status-dnd').click(function () {
                _converse.api.user.status.set('dnd');
                $('#loginDropdownParent').find('img.status.online.cursor-pointer.loginIconImg').attr('src', '../svg/dnd.svg');
            });
            $('#Logout').click(function () {
                window.resizeTo(650, 490);
                window.location.href = 'Sign.html';
                ipcRenderer.send('Sign-window');
            });
            /* --ONLINE STATUS CHANGE-- */

            /* SCREEN LOCK EVENT */
            ipcRenderer.send('screen-lock');
            ipcRenderer.once('lock-screen', function (event, lock) {
                _converse.api.user.status.set('away');
            });

            ipcRenderer.send('screen-unlock');
            ipcRenderer.once('unlock-screen', function (event, unlock) {
                _converse.api.user.status.set('online');
            });
            /* --SCREEN LOCK EVENT-- */

            /* INVITE SEND */
            $(document).ready(function () {
                $('.Invite').click(function () {
                    $(this).text('sent');
                    $(this).off();
                    $(this).attr('class', 'btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm disable ng-scope');
                    AllUserName.map(User => {
                        if (User.id == $(this).val()) {
                            const work = User_data.userDetails.worksOrgsDetails.active_workspace_id;
                            const contactId = `jdify_${work}_${User.id}@mongoose.netaxis.co`;
                            _converse.api.send(window.converse.env.$pres({
                                'from': client.jid,
                                'type': 'subscribe',
                                'to': contactId
                            }));
                        }
                    });
                });
            })
            /* --INVITE SEND-- */

            _converse.api.listen.on('rosterContactsFetched', function () {
                $('#contactReq').click(function () {
                    $('#main').hide();
                    $('#RequestContact').show();
                    $('#requestSent').empty();
                    $('#AcceptReq').empty();
                    const rosters = _converse.api.contacts.get();
                    rosters.forEach(el => {
                        if (el.attributes.ask == "subscribe" || el.attributes.subscription == 'to') {
                            const sent = el.attributes.jid.split('@')[0].split('_')[2];
                            AllUserName.map(all => {
                                if (all.id == sent) {
                                    $('#requestSent').append(`<div class="h-100 w-100 float-left overflow-auto p-20px customScrollBar">
                                                   <div class="d-flex mb-30px text-l ng-scope">
                                                   <img class="msgImageIcon" src="../svg/profile_icon/${all.name.charAt(0).toLowerCase()}.svg">
                                                   <div style="margin: 0 10px">
                                                    <div class="contactName">
                                                    <span class="ng-binding">${all.name}</span>
                                                    </div>
                                                    <div class="contactRequest font-14 font-weight-500 position-relative">
                                                    <div>You sent a friend request</div>
                                                    <div class="mt-20px"> <a href="#name">
                                                    <button class="btn c-btnPrimary Rounded font-12 font-weight-700">Start
                                                     Chat</button></a>
                                                    </div></div></div></div></div>`);
                                }
                            });
                        }
                        if (el.attributes.subscription == "subscribe" || el.attributes.subscription == 'from') {
                            const received = el.attributes.jid.split('@')[0].split('_')[2];
                            AllUserName.map(all => {
                                if (all.id == received) {
                                    $('#AcceptReq').append(`<div class="h-100 w-100 float-left overflow-auto p-20px customScrollBar">
                                                   <div class="d-flex mb-30px text-l ng-scope">
                                                   <img class="msgImageIcon" src="../svg/profile_icon/${all.name.charAt(0).toLowerCase()}.svg">
                                                   <div style="margin: 0 10px">
                                                    <div class="contactName">
                                                    <span class="ng-binding">${all.name}</span>
                                                    </div>
                                                    <div class="contactRequest font-14 font-weight-500 position-relative">
                                                    <div>sent you a friend request</div>
                                                    <div class="d-flex mt-20px">
                                                   <button value="${el.attributes.jid}" class="acceptReq btn c-btnPrimary Rounded mr-15px font-12 font-weight-700">Accept</button>
                                                   <button value="${el.attributes.jid}" class="DeclineReq btn c-btnSecondary Rounded font-12 font-weight-700">Decline</button>
                                                   </div></div></div></div></div>`);
                                }
                            });
                        }
                    });
                });
            });

            setTimeout(() => {
                $('.acceptReq').click(function () {
                    console.log($(this).text());
                    _converse.api.send(window.converse.env.$pres({
                        'from': client.jid,
                        'type': 'subscribed',
                        'to': $(this).val()
                    }));
                    _converse.api.send(window.converse.env.$pres({
                        from: client.jid,
                        to: $(this).val(),
                        type: "subscribe"
                    }));
                    setTimeout(() => { window.location.reload(); }, 2000)
                });
            }, 3000);

            $('#chatInfo').click(function () {
                const del = $("#contactRoster .contact.contactBlock.active").find('button').val();
                _converse.api.send(window.converse.env.$pres({
                    'type': 'unsubscribe',
                    'to': del
                }));

                const iq = window.converse.env.$iq({ type: 'set' })
                    .c('query', { xmlns: window.converse.env.Strophe.NS.ROSTER })
                    .c('item', { jid: del, subscription: "remove" });
                _converse.api.sendIQ(iq);
                setTimeout(() => { window.location.reload(); }, 2000)
            });

            setTimeout(() => {
                $('.DeclineReq').click(function () {
                    console.log($(this).text());
                    _converse.api.send(window.converse.env.$pres({
                        'type': 'unsubscribe',
                        'to': $(this).val()
                    }));

                    const iq = window.converse.env.$iq({ type: 'set' })
                        .c('query', { xmlns: window.converse.env.Strophe.NS.ROSTER })
                        .c('item', { jid: $(this).val(), subscription: "remove" });
                    _converse.api.sendIQ(iq);
                    setTimeout(() => { window.location.reload(); }, 2000)
                });
            }, 3000)

            _converse.api.listen.on('contactRequest', contact => {
                console.log(contact);
                if (contact.attributes.subscription == "subscribe" || contact.attributes.subscription == 'from') {
                    console.log('jok');
                    const received = el.attributes.jid.split('@')[0].split('_')[2];
                    AllUserName.map(all => {
                        if (all.id == received) {
                            $('#AcceptReq').append(`<div class="h-100 w-100 float-left overflow-auto p-20px customScrollBar">
                                                   <div class="d-flex mb-30px text-l ng-scope">
                                                   <img class="msgImageIcon" src="../svg/profile_icon/${all.name.charAt(0).toLowerCase()}.svg">
                                                   <div style="margin: 0 10px">
                                                    <div class="contactName">
                                                    <span class="ng-binding">${all.name}</span>
                                                    </div>
                                                    <div class="contactRequest font-14 font-weight-500 position-relative">
                                                    <div>sent you a friend request</div>
                                                    <div class="d-flex mt-20px">
                                                   <button value="${contact.attributes.jid}" class="acceptReq btn c-btnPrimary Rounded mr-15px font-12 font-weight-700">Accept</button>
                                                   <button value="${contact.attributes.jid}" class="DeclineReq btn c-btnSecondary Rounded font-12 font-weight-700">Decline</button>
                                                   </div></div></div></div></div>`);
                        }
                    });
                }
            });

            _converse.api.listen.on('rosterPush', iq => {
                console.log(iq);
                if (iq.attributes.subscription == "subscribe" || iq.attributes.subscription == 'from') {
                    const received = el.attributes.jid.split('@')[0].split('_')[2];
                    AllUserName.map(all => {
                        if (all.id == received) {
                            $('#AcceptReq').append(`<div class="h-100 w-100 float-left overflow-auto p-20px customScrollBar">
                                                   <div class="d-flex mb-30px text-l ng-scope">
                                                   <img class="msgImageIcon" src="../svg/profile_icon/${all.name.charAt(0).toLowerCase()}.svg">
                                                   <div style="margin: 0 10px">
                                                    <div class="contactName">
                                                    <span class="ng-binding">${all.name}</span>
                                                    </div>
                                                    <div class="contactRequest font-14 font-weight-500 position-relative">
                                                    <div>sent you a friend request</div>
                                                    <div class="d-flex mt-20px">
                                                   <button value="${iq.attributes.jid}" class="acceptReq btn c-btnPrimary Rounded mr-15px font-12 font-weight-700">Accept</button>
                                                   <button value="${iq.attributes.jid}" class="DeclineReq btn c-btnSecondary Rounded font-12 font-weight-700">Decline</button>
                                                   </div></div></div></div></div>`);
                        }
                    });
                }
            });

            /* USER LISTING */
            _converse.api.listen.on('rosterContactsFetched', function () {
                const rosters = _converse.api.contacts.get();
                rosters.forEach(el => {
                    AllUser.find(AllUser => {
                        if (el.attributes.subscription == "both") {
                            const jid = el.attributes.jid.split('@')[0].split('_')[2];
                            if (AllUser.id == jid) {
                                if (AllUser.profile_image != null) {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="${AllUser.profile_image}"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                        </div></div>`);
                                } else {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="../svg/profile_icon/${AllUser.name.charAt(0).toLowerCase()}.svg"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                       </div></div>`);
                                }
                                AllUser.id = null
                            }
                        } else if (el.attributes.ask == "subscribe" || el.attributes.subscription == 'to') {
                            const jid = el.attributes.jid.split('@')[0].split('_')[2];
                            if (AllUser.id == jid) {
                                if (AllUser.profile_image != null) {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="${AllUser.profile_image}"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                       <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm disable ng-scope">
                                                    Sent</button>
                                        </div></div>`);
                                } else {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="../svg/profile_icon/${AllUser.name.charAt(0).toLowerCase()}.svg"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                       <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm disable ng-scope">
                                                    Sent</button>
                                       </div></div>`);
                                }
                                AllUser.id = null
                            }
                        } else if (el.attributes.subscription == "subscribe" || el.attributes.subscription == 'from') {
                            const jid = el.attributes.jid.split('@')[0].split('_')[2];
                            if (AllUser.id == jid) {
                                if (AllUser.profile_image != null) {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="${AllUser.profile_image}"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                     <button
                                        class="btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm mr-5px">Accept</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm">
                                        Cancel</button>
                                        </div></div>`);
                                } else {
                                    $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="../svg/profile_icon/${AllUser.name.charAt(0).toLowerCase()}.svg"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                      <button
                                        class="btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm mr-5px">Accept</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm">
                                        Cancel</button>
                                       </div></div>`);
                                }
                                AllUser.id = null
                            }
                        }
                    });
                });

                AllUser.find(AllUser => {
                    if (AllUser.id != null) {
                        if (AllUser.profile_image != null) {
                            $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="${AllUser.profile_image}"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                        <button value="${AllUser.id}" class="Invite btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm">
                                        <span>Invite</span></button>
                                        <!--  <button
                                        class="btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm mr-5px">Accept</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm">
                                        Cancel</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm disable"></button> -->
                                        </div></div>`);
                        } else {
                            $('#allUsersDiv').append(`<div
                                       class="dropdown-item position-relative font-13  align-items-center contactRequestHover">
                                       <img style="border-radius:10px;" src="../svg/profile_icon/${AllUser.name.charAt(0).toLowerCase()}.svg"
                                       class="icon-30 mr-5px">
                                       <div class="contactRequestName pl-5px">
                                       <span style="cursor:pointer" class="font-14">${AllUser.name}</span></div>
                                       <div class="contactRequestMail">
                                       <span class="ml-5px font-11">${AllUser.email}</span></div>
                                       <div class="d-flex" style="margin-left: auto;cursor:pointer">
                                        <button value="${AllUser.id}" class="Invite btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm">
                                        <span>Invite</span></button>
                                        <!--  <button
                                        class="btn c-btnPrimary Rounded font-12 font-weight-700 c-btn-sm mr-5px">Accept</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm">
                                        Cancel</button>
                                        <button class="btn c-btnSecondary Rounded font-12 font-weight-700 c-btn-sm disable"></button> -->
                                       </div></div>`);
                        }
                    }
                });

            });
            /* --USER LISTING-- */

            /* --MEETING-- */
            $('#Meeting').click(function () {
                const reqID = $("#contactRoster .contact.contactBlock.active").find('button').val();
                const room = Math.random().toString(36).slice(2).substring(0, 15);
                const meetingLink = `https://meetings.netaxis.co/${room}`;
                const userID = {
                    name: User_data.userDetails.authUser.name,
                    email: User_data.userDetails.authUser.email
                }
                ipcRenderer.send('child', room, userID);
                const reply = window.converse.env.$msg({
                    to: reqID,
                    from: client.jid,
                    type: 'chat'
                }).c("body").t('Incomming call');
                reply.up().c("data", { action: 'call', url: meetingLink, room: room });
                _converse.api.send(reply);
            });
            /* --MEETING-- */
        }
    });

});