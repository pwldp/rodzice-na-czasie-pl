#!/usr/bin/node
//
// http://psitsmike.com/2012/02/node-js-and-mongo-using-mongoose-tutorial/
// 
// http://mongoosejs.com/docs/populate.html - pseudo-joins in mongoose
//
//
console.log("Normalizuje nazwy szkol...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Types.ObjectId
    , conf = require("../conf.js")
    , slugify = require ('slug')
//    , Voivodeship = require('./voivodeship')
    , City = require('./City')
    , School = require('./School')
    , ServiceGroup = require('./ServiceGroup')
//    , ServiceGroupMember = require('./ServiceGroupMember')
    ;

mongoose.set('debug', true);
mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});

/*
var newSG = ServiceGroup({
    name: "Pierwsza grupa testowa",
});
newSG.save();
*/
//------------------------------------------------------------------------------
/*
ServiceGroup.findOne({_id: "50acd3600b66b6316e000001"}, function(err, obj){
    if (err) throw err;
    console.log('FOUND by _id:'+obj);
});

ServiceGroup.findOne({school_id: "50b620971a615c104b0000bb"}, function(err, obj){
    if (err) throw err;
    console.log('FOUND by school_id:'+obj);
});
*/
/*
//------------------------------------------------------------------------------
*/
// distinct
//School.find({school_type: "00004"}).distinct("city_id", function(err, objList){
//School.find({school_type: "00004"}, function(err, objList){
//School.distinct("city_id", function(err, objList){
/*
School.distinct("city_id", {school_type: "00004"}, function(err, objList){
    if (err) throw err;
    City
    .where('_id').in( objList )
    .sort('name')
    .exec(function(err, itemsList) {
	var resList = [];
	itemsList.forEach(function(item) {
	    resList.push({
		'city_id': item._id, 
		'city_name': item.name, 
		'voiv_id': item.voivodeship_id,
		'voiv_name': item.voivodeship
	    });
	});
	res( {'ret': 'OK', 'msg':'', 'res': resList} );
    });
});
*/
/*
School.find({}, function(err, objList){
    objList.forEach(function(item){
	console.log("SCHOOL:"+item);
    });
});
*/
    School
    .where('school_type', "00004" )
    .where('city_id', "50b71f195bbdda32580005fd")
    .sort('name')
    .exec(function(err, itemsList) {
	var resList = [];
	itemsList.forEach(function(item) {
	    resList.push({
		'id': item._id, 
		'name': item.name, 
		'slug': item.slug,
		'city': item.city,
		'voivodeship': item.voivodeship,
		'zip': item.zipcode,
		'address': item.address,
		'www': item.www,
		'email': item.email,
		'phone': item.phone,
                'note': item.note
	    });
	});
	//res( {'ret': 'OK', 'msg':'', 'res': resList} );
	console.log(resList);
    });

//
// EOF
//