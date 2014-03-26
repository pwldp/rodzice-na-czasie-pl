//
// Obsluga dedykowanych akcji
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var SchoolType = require('../schema/SchoolType')
    , moment = require("moment")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Common..." );
    //
    return {
	//
	// Pobranie danych uzytkownika
	//
	getListCitiesVoivsForSchoolType: function( school_type_id ) {
	    console.log('getListCitiesVoivsForSchoolType...');
	    School.distinct("city_id", {school_type: school_type_id}, function(err, objList){
		//if (err) throw err;
		if (err) {
		    res( {'ret': 'ERR', 'msg':'Nie mogę pobrać danych.', 'res': []} );
		} else {
		    City
		    .where('_id').in( objList )
		    .sort('name')
		    .exec(function(err, itemsList) {
			var resList = [];
			itemsList.forEach(function(item) {
			    resList.push({
				'c_id': item._id, 
				'c_name': item.name, 
				'v_id': item.voivodeship_id,
				'v_name': item.voivodeship
			    });
			});
			res( {'ret': 'OK', 'msg':'', 'res': resList} );
		    });
		}
	    });
	}
    };	// do return
}
//
// EOF
//