//
// Obsluga CRUD dla SchoolSubject
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var SchoolSubject = require('../schema/SchoolSubject')
    , moment = require("moment")
    , localeComparePL = require("../lib/localeComparePL")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_SchoolSubject..." );
    //
    return {
	//
	// Pobranie listy przedmiotow z listy MEN
	//
	getListMENSchoolSubjects: function() {
	    console.log("getListMENSchoolSubjects...");
	    SchoolSubject
	    .find({user_id: null})
	    .select("-_id")
	    .select("id descr abbr name cat")
	    .exec(function(err, resList) {
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		if (!resList){
		    var resList = [];
		};
		resList.sort(function(a, b) {
		    return (a.name.localeComparePL(b.name));
		});
		res( {'ret': 'OK', 'msg':'', 'res': resList} );
	    });
	},
	//
	// Pobranie listy przedmiotow z listy uzytkownika
	//
	getListUserSchoolSubjects: function( user_id ) {
	    console.log("getListUserSchoolSubjects("+user_id+")...");
	    SchoolSubject
	    .find({user_id: user_id})
	    .sort('abbr')
	    .exec(function(err, resList) {
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		if (!resList){
		    var resList = [];
		};
		resList.sort(function(a, b) {
		    return (a.name.localeComparePL(b.name));
		});
		res( {'ret': 'OK', 'msg':'', 'res': resList} );
	    });
	},
	//
	// Zapisuje nowy przedmiot uzytkownika
	//
	putSchoolSubject: function( dObj ){
	    console.log("putSchoolSubject:"+dObj.user_id);
	    //
	    var newItem = new SchoolSubject();
	    //
	    if (dObj.user_id){
		console.log("putSchoolSubject: jest user_id");
		if (dObj.user_id.length===0) {
		    res( {'ret': 'ERR', 'msg':'Pole "user_id" nie może być puste', 'res': []} );
		    return;
		} else {
		    newItem.user_id = dObj.user_id;
		}
	    } else {
	    	console.log("putSchoolSubject: NIE ma user_id");
	    	res( {'ret': 'ERR', 'msg':'Brak pola "user_id"', 'res': []} );
	    	return;
	    }
	    //
	    if (dObj.name){
		if (dObj.name.length===0) {
		    res( {'ret': 'ERR', 'msg':'Pole "name" nie może być puste', 'res': []} );
		} else {
		    newItem.name = dObj.name;
		}
	    } else {
		res( {'ret': 'ERR', 'msg':'Brak pola "name"', 'res': []} );
	    }
	    //
	    if (dObj.abbr ){
		if (dObj.abbr.length===0) {
		    res( {'ret': 'ERR', 'msg':'Pole "abbr" nie może być puste', 'res': []} );
		} else {
		    newItem.abbr = dObj.abbr;
		}
	    } else {
		res( {'ret': 'ERR', 'msg':'Brak pola "abbr"', 'res': []} );
	    }
	    //
	    newItem.descr = dObj.descr;
	    newItem.cat = "prv";
	    //
	    console.log("Saving SchoolSubject:", newItem);
	    newItem.save(function(err, sObj) {
		if (err) {
		    res( {'ret': 'ERR', 'msg':'Błąd zapisu nowego przedmiotu ('+err+')', 'res': []} );
		} else {
		    res( {'ret': 'OK', 'msg':'', 'res': {'id': sObj._id}} );
		}
	    });
	    
	},
	//
	// Kasuje przedmiot uzytkownika
	//
	delSchoolSubject: function(user_id, subject_id){
	    console.log("delSchoolSubject:"+subject_id);
	    SchoolSubject.remove({ _id: subject_id, user_id: user_id }, function(err) {
	        if (err) {
	    	    res( {'ret': 'ERR', 'msg':'Wystąpił błąd kasowania: '+err, 'res': []} );
	        } else {
	    	    res( {'ret': 'OK', 'msg':'', 'res': []} );
		}
	    });
	}
    };	// do return
}
//
// EOF
//