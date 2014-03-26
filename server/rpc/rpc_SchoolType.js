//
// Obsluga CRUD dla SchoolType
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
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_SchoolType..." );
    //
    return {
	//
	// Pobranie listy przedmiotow z listy MEN
	//
	getListSchoolTypes: function() {
	    console.log("getListSchoolTypes...");
	    SchoolType
	    .find({})
	    .sort('name')
	    .exec(function(err, itemsList) {
		var resList = [];
		var popularity = 0;
		if (itemsList){
		    itemsList.forEach(function(item) {
			if (item.popularity){
			    popularity = item.popularity;
			} else {
			    popularity = 0;
			};
			resList.push({id: item._id, name: item.name, slug:item.slug, popularity:popularity});
		    });
		};
		res( {'ret': 'OK', 'msg':'', 'res': resList} );
	    });
	}
    };	// do return
}
//
// EOF
//