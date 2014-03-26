#!/usr/bin/node
//
// laduje typy szkol do db
//
console.log("Laduje typy szkol do DB...");
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Types.ObjectId
    , conf = require("../conf.js")
    , ServiceUser = require('./ServiceUser')
    ;
//
//
mongoose.set('debug', true);
mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});
//
var listDemoUsers = [
{
    username: 'demo1',
    password: '1omed',
    first_name: 'Konto1',
    last_name: 'Demo1',
    email: 'demo1@demo.de',
    phone: '+48123456789',
    gender: 'male'
},
{
    username: 'demo2',
    password: '2omed',
    first_name: 'Konto2',
    last_name: 'Demo2',
    email: 'demo2@demo.de',
    phone: '+48123456789',
    gender: 'male'
},
{
    username: 'demo3',
    password: '3omed',
    first_name: 'Konto3',
    last_name: 'Demo3',
    email: 'demo3@demo.de',
    phone: '+48123456789',
    gender: 'male'
}
]
//
//
listDemoUsers.forEach(function(item) {
    console.log("Uzytkownik:"+item.username);
    var newItem = new ServiceUser({
	username: item.username,
	password: item.password,
	first_name: item.first_name,
	last_name: item.last_name,
	email: item.email,
	phone: item.phone,
	gender: item.gender
    });
    newItem.save();
});

//
// EOF
//