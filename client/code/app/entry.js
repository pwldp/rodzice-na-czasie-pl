// This file automatically gets called first by SocketStream and must always exist

// Make 'ss' available to all modules and the browser console
window.ss = require('socketstream');

ss.server.on('disconnect', function(){
  console.log('Connection down :-(');
//  ss.heartbeatStop();
});

ss.server.on('reconnect', function(){
  console.log('Connection back up :-)');
//  ss.heartbeatStart();
});

//
// Pokazuje przychodzaca wiadomosc w okienku alert 
//
ss.event.on('msg', function(msg){
    console.log("Przyszla wiadomosc: "+JSON.stringify(msg));
});
//
// Users online info
//
ss.event.on('ol', function(msg){
    console.log("User online info: "+JSON.stringify(msg));
});
//ss.heartbeatStart();
//
// info o ankietach
ss.event.on('poll', function(msg){
    console.log("Info o ankiecie: "+JSON.stringify(msg));
});
//
// info o zaproszeniu do grupy
ss.event.on('grpinvit', function(msg){
    console.log("Info o zaproszeniu do grupy: "+JSON.stringify(msg));
});
//
//

require('ssAngular');
require('/controllers');
ss.server.on('ready', function(){

  jQuery(function(){
    ss.server._events['application_is_ready'] = 1;
    require('/app');

  });

});
