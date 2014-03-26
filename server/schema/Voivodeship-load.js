#!/usr/bin/node
//
//
console.log("Laduje dane inicjujace dla serwisu SD...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    //, ObjectId = mongoose.Types.ObjectId
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
Voivodeship.collection.drop()
var itemList = require('./Voivodeship-json');
itemList.forEach(function(item) {
    console.log("Wojewodztwo:", item.fields);
    
	var newItem = Voivodeship({
	    name: item.fields.name,
	    pk: parseInt(item.pk, 10)
	});
	newItem.save();
});

//
// EOF
//