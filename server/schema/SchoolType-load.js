#!/usr/bin/node
//
//
//
console.log("Laduje dane inicjujace dla serwisu SD...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Types.ObjectId
    , conf = require("../conf.js");

console.log("conf="+conf);

mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});
//
//==============================================================================
//
// Wczytuje rodzaje placowek oswiatowych MEN
//
var SchoolType = require('./SchoolType');
SchoolType.collection.drop();
var schollTypesList = require('./SchoolType-json');
schollTypesList.forEach(function(item) {
    console.log("schoolType:", item);
    var newST = new SchoolType({
	"pk":parseInt(item.pk,10), 
	"name": item.fields.name,
	'type':item.fields.type
    });
    console.log("Zapisuje typ szkoly: ", newST.name);
    newST.save();
    //
    /*
    SchoolType.findOne({"pk": item.pk}, function(err, item){
	if (item){
	    console.log("Jest typ szkoly:", item.name);
	    if (item.name !== newST.name || item.type !== newST.type){
		console.log("Aktualizuje=",item);
		item.name = newST.name;
		item.type = newST.type;
		item.save()
	    }
	} else {
	    console.log("Nie ma typu szkoly:", newST.name);
	    newST.save();
	}
    });
    */
});
    
//
// EOF
//