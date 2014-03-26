//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var ServiceUser = require('../schema/ServiceUser.js')
    , crypto = require('crypto')
    , util = require("util")
    , moment = require("moment")
    , os = require("os")
    ;
//
var intervalId = {};
//

exports.actions = function(req, res, ss) {
    req.use('session');
    //req.use('user.getUserLists');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_authorization..." );
    //

    return {
    /*
    	users_online: function() {
    	    console.log("Counting online users...");
    	    clearInterval(intervalId);
    	    setTimeout(function() {
    		res("345");
    	    }, 2000);
	},
	*/
    authenticate: function(userName, userPass) {
    // http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
	if (userName==null){
	    userName = '';
	}
	if (userPass==null) {
	    userPass = '';
	}
	if (os.hostname()==="franio" || os.hostname()==="edmo") {
	    ss.log("User:", userName, "Pass: ", userPass );
	};
	
	ServiceUser.getAuthenticated(userName.toLowerCase(), userPass, function(err, user, reason) {
	    //if (err) throw err; -- obsluga teg obledu nie moze wystepowac gdyz staje cala aplikacja
	    // login was successful if we have a user
	    if (user) {
		// handle login success
		console.log('login success:',user);
		req.session.setUserId(user._id);
		var userInfo = {
		    id: user._id,
		    first_name: user.first_name,
		    last_name: user.last_name,
		    email: user.email
		};
		req.session.user = userInfo;
		req.session.save();
		return res( {'ret':'OK', 'msg':'', 'res':true} );
	    } else {
		req.session.setUserId(null);
		req.session.user = {};
		res(false);
		return res( {'ret':'ERR', 'msg':'Nie znaleziono użytkownika (1).', 'res':true} );
	    }
	    // otherwise we can determine why we failed
	    var msg = "";
	    var reasons = ServiceUser.failedLogin;
	    switch (reason) {
		case reasons.NOT_FOUND:
		    msg = "Nie znaleziono użytkownika (1).";
		    break;
		case reasons.PASSWORD_INCORRECT:
		// note: these cases are usually treated the same - don't tell
		// the user *why* the login failed, only that it did
		    msg = "Podano błedne hasło.";
		    break;
		case reasons.MAX_ATTEMPTS:
		    // send email or otherwise notify user that account is
		    // temporarily locked
		    msg = "Przekroczona liczba błędnych logowań.";
		    break;
	    }
	    return res( {'ret':'ERR', 'msg':msg, 'res':true} );
	});
    },
    authenticated: function() {
	//
	if(req.session.userId) {
    	    console.log("authorization::rpc::authenticated, userId="+req.session.userId);
    	    res(true);
	} else {
	    console.log("authorization::rpc::authenticated, NOT AUTHENTICATED");
	    res(false);
	    //res( {ret:'ERR', msg:'User not authenticated'} );
	}
    },
    logout: function() {
	console.log("rpc::logout()");
	console.log("LOGOUT->SESSION: "+util.inspect(req.session));
        req.session.setUserId(null);
//        req.session = {state: 'empty' };
        req.session.save();
        res(true);
    },
    /*
    lin: function() {
	var userId = "50adff10d1fbee9751000001";	// DEMO1
//	var userId = "50adff10d1fbee9751000002";	// DEMO2
//	var userId = "50adff10d1fbee9751000003";	// DEMO3
//	var userId = "50fffc3e12b10c1d3d000001";	// pawlakdp

	console.log("rpc::lin - developerska autentykacja usera DEMO ('"+userId+"')");
	req.session.setUserId( userId );
        //req.session.setUserId("50adff10d1fbee9751000003");
//        console.log("SESSION: "+util.inspect(req.session));
        res({msg:"Zalogowałem uzytkownika ID="+userId});
    },
    lin1: function() {
	var userId = "50adff10d1fbee9751000001";	// DEMO1
	console.log("rpc::lin1 - developerska autentykacja usera DEMO1 ('"+userId+"')");
	req.session.setUserId( userId );
        res({msg:"Zalogowałem uzytkownika ID="+userId});
    },
    lin2: function() {
	var userId = "50adff10d1fbee9751000002";	// DEMO2
	console.log("rpc::lin2 - developerska autentykacja usera DEMO2 ('"+userId+"')");
	req.session.setUserId( userId );
	
	var userInfo = {
	    id: userId,
	    first_name: "Demo2",
	    last_name: "DEMO2",
	    email: "demo1@fqdn.dom"
	};
	req.session.user = userInfo;
	req.session.save();
	
        res({msg:"Zalogowałem uzytkownika ID="+userId});
    },
    lin3: function() {
	var userId = "50adff10d1fbee9751000003";	// DEMO3
	console.log("rpc::lin3 - developerska autentykacja usera DEMO3 ('"+userId+"')");
	req.session.setUserId( userId );
        res({msg:"Zalogowałem uzytkownika ID="+userId});
    },
    */
    linuser: function(usr_name){
	console.log("DEV: logowanie, szukam usera:"+usr_name);
	req.session.setUserId(null);
	ServiceUser.findOne({username:usr_name}, function(err, usr){
	    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
	    if (usr){
		req.session.setUserId( usr._id);    
		req.session.save();
		console.log("DEV: Zalogowalem usera:"+usr_name);
		res({msg:"Zalogowałem uzytkownika ID=ObjectId('"+usr._id+"') , nazwa: "+usr.username});
	    } else {
		console.log("DEV: Brak usera:"+usr_name);
		res( {'ret':'ERR', 'msg':'Nie znalazlem podanego uzytkownika!', 'res':[]} );
	    };
	});
    },
    

  };
}
