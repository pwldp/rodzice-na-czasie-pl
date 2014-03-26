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
    ;
//
//var intervalId = {};
//var crypto = require('crypto');
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');

    return {
	//
	// Pobranie listy wojewodztw
	//
	getVoivodeships: function() {
	    console.log("spatial::getVoivodeships..");
	    Voivodeship
	    .find({pk: {$gt: 0}})
	    .sort('name')
	    .exec(function(err, voivList) {
		var vList = [];
		voivList.forEach(function(item) {
		    //console.log("wojew:"+item.name);
		    vList.push({'id': item._id, 'pk': item.pk, 'name': item.name});
		});
		res( {'ret': 'OK', 'msg':'', 'res': vList} );
	    });
	},
	//
	// Pobranie listy miast dla podanego wojewodztwa
	//
	getCities: function() {
	    console.log("spatial::getCities (woj. mazowieckie)...");
	    var cList = [];
	    // 50a90c68b5ef566106000009, 14 == woj. mazowieckie
	    City
	    .find({pk: {$gt: 0}, voivodeship_pk: 14})
	    .sort('name')
	    .exec(function(err, voivList) {
		var itemList = [];
		voivList.forEach(function(item) {
		    //console.log("city:"+item.name);
		    itemList.push({'id': item._id, 'pk': item.pk, 'name': item.name});
		});
		res( {'ret': 'OK', 'msg':'', 'res': itemList} );
	    });
	}
    };	// do return
}
