//
// Middleware do obslugi uzytkownikow
//
var conf = require("../../conf")
    , util = require("util")
    , Kid = require("../schema/Kid")
    , KidsParent = require("../schema/KidsParent")
    , ServiceUser = require("../schema/ServiceUser")
    ;
//
// Spr. czy user jest zalogowany
//
exports.checkAuthenticated = function(){
    return function(req, res, next){
//	req.session.user_kids = null;
	//console.log("SESSION: "+util.inspect(req.session));
	if (req.session && req.session.userId){
/*

Podwojne wywolanie funkcji

	    //console.log("LAST_ACTIVITY: "+req.session.last_activity);
	    var saveActivity=false;
	    //console.log("LAST_ACTIVITY::diff "+(Date.now()-req.session.last_activity));
	    if (req.session.last_activity===undefined){
		req.session.last_activity=Date.now();
		req.session.save();
		saveActivity=true;
	    } else if (Date.now()-req.session.last_activity>600000){
		//console.log("LAST_ACTIVITY::diff "+(Date.now()-req.session.last_activity));
		req.session.last_activity=Date.now();
		req.session.save();
		saveActivity=true;
	    };
	    if (saveActivity===true){
		ServiceUser.update({_id:req.session.userId},{last_activity:Date.now()}, function(err,upd){
		    if (err) console.err(err);
		    return next();
		});
	    };
*/
	    return next();
	};
	res(false); // Access denied: prevent request from continuing
    }
}
//
// Zapisuje do zmiennej sesyjnej informacje o listach uzytkownika (dzieci, grupy prywatne etc)
//
exports.getUserLists = function(){
    return function(req, res, next){
	console.log("user::getUserLists("+req.session.userId+")..."+Date.now());
	//
	//console.log("user::getUserLists::req.session.user_kids(1)="+req.session.user_kids);
	if (req.session.user_kids===undefined || req.session.user_kids===null || req.session.user_kids.length===0){
	//if (true===true) {
	    //
	    req.session.user_kids = [];
	    //
	    KidsParent.find({user_id: req.session.userId}, function(err, listKids){
		if (err) {
		    console.log("user.js :: getUserLists: "+err);
		    res(false);
		} else {
		    //console.log("listKids="+util.inspect(listKids));
		    if (listKids) {
			listKids.forEach(function(item){
			    //console.log("Dodaje dziecko do user_kids: "+item.kid_id);
			    req.session.user_kids.push( item.kid_id );;
			});
		    };
		    console.log("user::getUserLists::req.session.user_kids(2)="+req.session.user_kids);
		};
	    });
	    //req.session.user_kids.push( '1234567890' );

	}
	//
	// grupy prywatne uzytkownika
	console.log("user::getUserLists::req.session.user_private_groups="+req.session.user_private_groups);
	if (req.session.user_private_groups===undefined || req.session.user_private_groups===null){
	    //
	    req.session.user_private_groups = [];
	};
	//
	//console.log("SESSION: "+util.inspect(req.session));
	next();
    }
}
//
// EOF
//