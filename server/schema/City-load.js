#!/usr/bin/node
//
//
console.log("Laduje dane inicjujace dla serwisu SD...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    //, ObjectId = mongoose.Types.ObjectId
    , City = require("./City")
    , Voivodeship = require("./Voivodeship")
    , conf = require("../conf.js")
    ;
//
mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});
//
//==============================================================================
//
// Wczytuje liste miast
//
City.collection.drop()
var itemList = require('./City-json');
itemList.forEach(function(item) {
    console.log("Miasto:", item.fields);
    var voiv_id = parseInt(item.fields.province, 10);
    Voivodeship.findOne({pk: voiv_id}, function(err, itemVoiv){
	if (err) throw err;
	console.log("\twoj.:", itemVoiv.name);
	var newItem = City({
	    name: item.fields.name,
	    voivodeship_id: itemVoiv._id,
	    voivodeship: itemVoiv.name,
	    pk: parseInt(item.pk, 10)
	});
	newItem.save();
    });
});
//
// EOF
//