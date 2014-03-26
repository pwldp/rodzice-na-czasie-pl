//
// Zapis nowego uzytkownikaa do DB
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.01.23
//
var ServiceUser = require("../schema/ServiceUser")
    , generatePassword = require('password-generator')
    , util = require("util")
    ;
//
//
//
module.exports = function add_new_user(uI, cb){
    console.log("function addNewUser()..."+util.inspect(uI));
    ServiceUser.findOne({username: uI.email}, function(err, dbUser){
	console.log("function addNewUser() - szukam");
	if (err) {
	    return cb(err, null);
	} else {
	    if (dbUser) {
		console.log("APP: user juz jest w DB");
	    } else {
		console.log("APP: dodaje do DB nowego usera");
		dbUser = new ServiceUser();
		dbUser.id = dbUser._id;
		dbUser.username = uI.email;
		dbUser.name = uI.name;
		if (uI.email===undefined){
		    uI.email = "no@no.ne";
		};
		dbUser.email = uI.email;
		dbUser.avatar_id = null;
		dbUser.origin_name= uI.origin_name;
		dbUser.origin_id= uI.origin_id;
		if (uI.origin_perms){
		    dbUser.origin_perms = uI.origin_perms;
		};
		if (uI.origin_publish){
		    dbUser.origin_publish = uI.origin_publish;
		} else {
		    dbUser.origin_publish = false;
		};
		dbUser.access_token = uI.access_token;
		dbUser.first_name = uI.first_name;
		dbUser.last_name = uI.last_name;
		dbUser.phone = uI.phone;
		dbUser.gender = uI.gender;
		dbUser.born_date = uI.born_date;
	    };
	    //
	    if (dbUser.password===undefined || dbUser.password.length===0){
		dbUser.password = generatePassword(12, false);
	    };
	    //
	    dbUser.last_activity = Date.now();
	    //
	    dbUser.save(function(err){
		console.log("function addNewUser() - save()");
		if (err) { 
		    console.log("function addNewUser() - ERROR="+err);
		    return cb(err, null) 
		} else {
		    console.log("function addNewUser() - return dbUser =="+util.inspect(uI));
		    return cb(null, dbUser);
		};
	    });

	};
    });	// do ServiceUser.findOne
};
//
// EOF
//