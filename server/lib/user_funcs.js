//
// Funkcje dodatkowe do obslugi danych uzytkownikow
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.01.03
//
var KidsParent = require("../schema/KidsParent");
var util = require("util");
//var redCli = require("../libs/redis_cache");
//
// Zwraca IDs dzieci dla ktorych podany uzytkownik jest rodzicem
//
exports.checkAccess_User2Kid = function(){
//    return function(req, res, kid_id, cb){
    return function(req, res, kid_id, cb){
	//req.use('session');
	var start = +new Date();
	/*
	req.session.reload(function(err){
	    console.log("SESSION reloaded");
	    console.log("user_funcs::checkAccess_User2Kid, po req.RELOAD() session="+util.inspect(req.session));
	});
	*/
	//redCli.set("string key", "string val", redis.print);
	//console.log("user_funcs::checkAccess_User2Kid, po req.use() session.user_kids="+req.session.user_kids);
	//console.log("user_funcs::checkAccess_User2Kid, po req.use() session="+util.inspect(req.session));
	//console.log("user_funcs::checkAccess_User2Kid(user_id="+req.session.userId+", kid_id="+kid_id+")..."+Date.now());
	if (kid_id!==undefined) {
		var kidId = kid_id;
		//console.log("user_funcs::checkAccess_User2Kid(user_id="+req.session.userId+", kidId="+kidId+")..."+Date.now());
		if (req.session.user_kids===undefined || req.session.user_kids===null || req.session.user_kids.length===0){
		    //console.log("user_funcs::checkAccess_User2Kid, CZYTAM Z DB... bo="+util.inspect(req));//.session.user_kids);
		    KidsParent.find({user_id: req.session.userId}, function(err, listKids){
			if (err) {
			    //console.log("user_funcs :: checkAccess_User2Kid: "+err);
			    return cb(err, false);;
			} else {
			    //console.log("listKids="+util.inspect(listKids));
			    var tmp = [];
			    if (listKids) {
				listKids.forEach(function(item){
				    //console.log("Dodaje dziecko do user_kids: "+item.kid_id);
				    //req.session.user_kids.push( item.kid_id );
				    tmp.push( String(item.kid_id) );
				});
			    };
			    req.session.user_kids = tmp;
			    req.session.save(function(err){
				//console.log('Session data has been saved:', req.session); 
			    //});
				//console.log("user::checkAccess_User2Kid::req.session.user_kids(2)="+req.session.user_kids);
				//console.log("user::checkAccess_User2Kid::req.session.user_kids(2).indexOf="+req.session.user_kids.indexOf(kid_id)+","+kid_id+" w "+req.session.user_kids);
				var end = +new Date();
				console.log("user::checkAccess_User2Kid exec time: " + (end-start) + " milliseconds");
				if (req.session.user_kids.indexOf(kid_id)>-1){
				    return cb(null, true);
				} else {
				    return cb(null, false);
				};
			    });	// save.session
			};
		    });
		} else {; // do if (req.sess...
		    console.log("user::checkAccess_User2Kid::req.session.user_kids(3)="+req.session.user_kids.indexOf(kid_id));
		    if (req.session.user_kids.indexOf(kid_id)>-1){
			return cb(null, true);
		    } else {
			return cb(null, false);
		    };
		};
	} else {
    	    return cb("Parameter required: kid_id.", false);
        };
    };
};
/*
exports.setUserKids = function(){
    return function(user_id){
    console.log("user_funcs::setUserKids(user_id="+user_id+")..."+Date.now());
	KidsParent.find({user_id: user_id}, function(err, listKids){
		if (err) {
		    console.log("user.js :: getUserLists: "+err);
		    return [];
		} else {
		    //console.log("listKids="+util.inspect(listKids));
		    var tmp = [];
		    if (listKids) {
			listKids.forEach(function(item){
			    console.log("Dodaje dziecko do user_kids: "+item.kid_id);
			    //req.session.user_kids.push( item.kid_id );
			    tmp.push( item.kid_id );
			});
		    };
		    return tmp;
		    console.log("user::getUserLists::req.session.user_kids(2)="+req.session.user_kids);
		};
	    });
    };
};
*/
//
// Zapisuje do zmiennej sesyjnej informacje o listach uzytkownika (dzieci, grupy prywatne etc)
//
/*
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
	console.log("SESSION: "+util.inspect(req.session));
	next();
    }
}
*/
//
// EOF
//