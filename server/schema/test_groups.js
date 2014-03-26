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
    , Voivodeship = require('./voivodeship')
    , City = require('./City')
    , School = require('./School')
    , ServiceGroup = require('./ServiceGroup')
    , ServiceGroupMember = require('./ServiceGroupMember')
    ;

mongoose.set('debug', true);
mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});


var newSG = ServiceGroup({
    name: "Pierwsza grupa testowa",
});
newSG.save();

//
// EOF
//