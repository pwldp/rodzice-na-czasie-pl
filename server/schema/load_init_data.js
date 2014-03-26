#!/usr/bin/node
//
// http://psitsmike.com/2012/02/node-js-and-mongo-using-mongoose-tutorial/
// 
// http://mongoosejs.com/docs/populate.html - pseudo-joins in mongoose
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



var ServiceUser = require('./serviceuser.js');
/*
ServiceUser.findOne({_id: '1'}, function(err,item){
//ServiceUser.findById({_id: "50a39641534c3276d5936319"}, function(err,item){

    if (err) throw err;
    console.log("item=",item);
});
*/

//var myObjectId = ObjectId.fromString('myhexstring');
var newObjId = new ObjectId(2);
console.log("newObjId=",newObjId);


//
// Wczytuje wojewodztwa
//
var Voivodeship = require('./voivodeship');
var voivodeshipList = require('./voivodeship-json', function(){
console.log("Wczytuje wojewodztwa...");
});
//
/*
for(var i=0; i<voivodeshipList.length; i++) {
    var item = voivodeshipList[i];
    console.log("item: "+JSON.stringify(item));
    var model = item.model.toLowerCase().split(".")[1];
    var newV = {pk: parseInt(item.pk, 10), name: item.fields.name};
    Voivodeship.upsert( newV );
}
*/
//
// Wczytuje miasta
//
var City = require('./city');
var citiesList = require('./city-json');
citiesList.forEach(function(item) {
    var vovPK = parseInt(item.fields.province);
    var newCity = new City({"pk":parseInt(item.pk,10), "name":item.fields.name, 'voivodeship_pk': vovPK});
    City.findOne({"pk": item.pk}, function(err, itemCity){
	if (itemCity){
	
	    //var vov = new Voivodeship({pk: item.pk});
	    var vovObj = Voivodeship.getVoivodeshipByPK(item.fields.province);
	    //console.log("woj by PK=", vovObj);
	    //console.log("woj by PK=", vov);

      /*
	    Voivodeship.find({pk: item.pk}, function(err, item) {
	console.log("("+itemPK+") item woj=",item);
    	if (err) return cb(err);
	cb(null, item);
    });
    */
	
	    if (itemCity.name !== newCity.name){
		console.log("Aktualizuje=",itemCity);
		itemCity.name = newCity.name;
		itemCity.save()
	    }
	} else {
	    newCity.save( function (err) {
		//if (err) return handleError(err);
	      
	    });
	} 
	//
	/*
	City
	.findOne({pk:vovPK })
	.populate('voivodeship')
	.exec(function (err, story) {
	    if (err) throw err;
	    console.log('wojewodztwo %s', City.voivodeship);
	})
	*/
	
    });
});

/*
City.findOne({pk:0}, function(err, item){
    if (item){
	console.log("znalazlem:"+item);
	Voivodeship.findOne({"pk": 16}, function(err, vItem){
//	Voivodeship.find({"_id": ObjectId("50a90c68b5ef566106000012")}, function(err, vItem){
	    console.log("Znalazlem wojewodztwo:"+vItem);
	});
    }
});
*/
//
//==============================================================================
//
// Wczytuje rodzaje placowek oswiatowych MEN
//
var SchoolType = require('./school_type');
var schollTypesList = require('./school_type-json');
schollTypesList.forEach(function(item) {
    console.log("schoolType:", item);
    var newST = new SchoolType({
	"pk":parseInt(item.pk,10), 
	"name": item.fields.name,
	'type':item.fields.type
    });
    //
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

});
    
//
// EOF
//