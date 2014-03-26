//
// Obsluga modelu: KidParent
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Student = require('../schema/KidsParent')
    , moment = require("moment")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_KidsParent..." );
    //
    return {
	//
	// Pobranie listy rodzicow dziecka
	//
	getKidsParents: function(kid_id) {
	    console.log("getKidsParents...");
	    Kid.find({'kid_id': kid_id}, function(err, itemsList){
		if (err) {
		    res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		} else {
		console.log("2. getKidsParents...");
		    var resList = [];
		    if (itemsList){
			itemsList.forEach(function(item) {
			    var resList = {
			        kid_id: item.kid_id, 
				parent_id: item.parent_id, 
				level: item.level
			    } ;
			});
			console.log("3. getKidsParents...");
		    };
		    console.log("4. getKidsParents...");
		    res( {'ret': 'OK', 'msg':'', 'res': resList} );
		};
		//console.log(resList);
	    });
	},
	//
	// ustawia rodzica dla dziecka
	//
	setKidsParent: function(kid_id, user_id, level){
	    console.log("setKidsParent...");
	    res( {'ret':'OK', 'msg':'', 'res':[]} );
	}

    };	// do return
}
//
// EOF
//