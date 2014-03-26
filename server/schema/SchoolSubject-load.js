#!/usr/bin/node
//
//
console.log("Laduje dane inicjujace dla serwisu SD...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , SchoolSubject = require("./SchoolSubject")
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
// Wczytuje liste przedmiotow
//

var listSchoolSubject = require('./SchoolSubject-json');
listSchoolSubject.forEach(function(item) {
    console.log("SchoolSubject:", item.fields.abbr);

    var newItem = new SchoolSubject({
	//user_id: null,
	//id: 0,
	name: item.fields.name,
	descr: item.fields.description,
	abbr: item.fields.abbr.toUpperCase(),
	cat: item.fields.cat
    });
    //console.log("SchoolSubject:", newItem);
    //console.log("SchoolSubject::collection:", newItem.collection.name);
    newItem.save();
});
//
// dropuje kolekcje przedmiotow szkolnych
SchoolSubject.collection.drop()
/*
SchoolSubject.getMENSchoolSubjects(function(err, items){
    console.log("item="+items);
})
*/
/*
    var newItem = new SchoolSubject({
	name: "nazwa przedmiotu",
	description: "jakis opis",
	abbr: "PRZED"
    });
    console.log("SchoolSubject:", newItem);
    newItem.save(function(err, sObj) {
       console.log(sObj.id);
    });

*/
//
// EOF
//