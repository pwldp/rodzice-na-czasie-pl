//
// Obsluga pobierania danych z list: 
// * wojewodztwa
// * miasta
// * typy szkol
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Voivodeship = require('../schema/Voivodeship.js')
    , City = require('../schema/City.js')
    , moment = require("moment")
    , localeComparePL = require("../lib/localeComparePL");
    ;
//
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');

    return {
	//
	// Pobranie listy wojewodztw
	//
	getListVoivodeships: function() {
	    console.log("getVoivodeships..");
	    Voivodeship
	    .find({terc: {'$ne':'00'}})
	    .select('_id name')
	    .sort('name')
	    .exec(function(err, voivList) {
	    	if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		var vList = [];
		if (voivList){
		    voivList.forEach(function(item) {
			vList.push({'id': item._id, 'name': item.name});
		    });
		};
		vList.sort(function(a,b) {
		    return (a.name.localeComparePL(b.name));
		});
		res( {'ret': 'OK', 'msg':'', 'res': vList} );
	    });
	},
	//
	// Pobranie listy miast dla podanego wojewodztwa
	//
	getListCities: function(voiv_id,has_school) {
	    console.log("getListCities("+voiv_id+")...");
	    if (voiv_id===undefined || !voiv_id){
		return res( {'ret':'ERR', 'msg':'Brak wymaganych parametrów', 'res':[]} );
	    }

	    if (has_school===undefined){
		has_school=true;
	    };

	    //var cList = [];
	    City
	    //.find({pk: {$gt: 0}, voivodeship_id: voiv_id })
	    .find({voiv_id: voiv_id, has_school:has_school })
	    //.find({voiv_id: voiv_id })
	    //.where("voiv_id",voiv_id)
	    .select("_id name")
	    .sort('name')
	    .exec(function(err, voivList) {
	    	if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//  console.log("voivList="+voivList);
		var itemList = [];
		if (voivList){
		    voivList.forEach(function(item) {
			itemList.push({id: item._id, name: item.name});
		    });
		};
		itemList.sort(function(a,b) {
		    return (a.name.localeComparePL(b.name));
		});
		return res( {'ret': 'OK', 'msg':'', 'res': itemList} );
	    });
	}
    };	// do return
}
//
// EOF
//