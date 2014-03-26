//
// Middleware do sprawdzania, czy uzytkownik polaczyl sie przy uzyciu 
// obslugiwanej przez RNC przegladarki internetowej.
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.01.08
//
// Obsluga WebSockets przez przeglądarki: 
// * http://caniuse.com/websockets
// * http://stackoverflow.com/questions/4262543/what-are-good-resources-for-learning-html5-websocket
// * http://stackoverflow.com/questions/1253683/what-browsers-support-html5-websocket-api
//

//var r = require('ua-parser');//.parse(navigator.userAgent);

var util = require("util")
    , r = require('ua-parser')
    , getClientIP = require("../../server/lib/getClientIP")
    ;
//
function dbg( txt ){
    var moment = require("moment")
	, colors = require('colors')
	;
    var now = moment();
    console.log('-'.yellow + '' + now.format("YYYY-MM-DD HH:mm:ss").yellow + "  " + txt.yellow );
}
//
module.exports = function checkBrowser( req, res ) {
//    return true;
/*
    dbg("CheckBrowser('"+req.headers['user-agent']+"')...");
    //dbg("req.url="+req);
*/
    var rua = r.parse(req.headers['user-agent']);
    var ua_name = rua.family.toLowerCase();
    var ua_version = parseInt(rua.major, 10);
    var cip = getClientIP(req)
    dbg("CheckBrowser: "+ ua_name + ", major version: "+ua_version);
    dbg("CheckBrowser: IP:"+ cip);
    //
    if (ua_name==='firefox' && ua_version>=11) {
	return true;
    } else if ((ua_name==='chromium' || ua_name==='chrome') && ua_version>=14) {
	return true;
    } else if (ua_name==='ie' && ua_version>=10) {	    
	return true;
    } else if (ua_name==='safari' && ua_version>=6) {	    
	return true;
    } else if (ua_name==='dolfin' && ua_version>=3) {	    
	return true;
    } else if (ua_name==='android' && ua_version>=4) {	    
	return true;
    } else if (ua_name==='opera' && ua_version>=12) {	    
	return true;
    } else if (ua_name==='rekonq') {	    
	return true;
    } else if (ua_name==='googlebot') {
	return true;
    } else if (ua_name==='yandexbot') {
	return true;
    } else if (ua_name==='facebookbot') {
	return true;
    } else if (ua_name==='twitterbot') {
	return true;
    } else {
	return false;
    }
 
};
//};
//
// EOF
//