//
// Definicja modelu do obslugi uzytkownikow serwisu
//
// Kod sciagniety z: 
// * http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
// *http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
//
//
//==============================================================================
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    // these values can be whatever you want - we're defaulting to a
    // max of 10 attempts, resulting in a 24 hour lock
    MAX_LOGIN_ATTEMPTS = 10,
    LOCK_TIME = 24 * 60 * 60 * 1000;
//
//==============================================================================
var VoivodeshipSchema = new Schema({
    name: { type: String, required: true, index: { unique: true } },
});


VoivodeshipSchema
{"id": 0, "name": ""}
,{"id": 2,"name": "dolnośląskie"}
,{"pk": 4,
"name": "kujawsko-pomorskie"
,{
"pk": 6,
	"name": "lubelskie"
	,{
	"pk": 8,
		"name": "lubuskie"
	,{
	"pk": 10,
		"name": "łódzkie"
	,{
	"pk": 12,
		"name": "małopolskie"
		}
	}
	,{
	"pk": 14,
		"name": "mazowieckie"
	,{
	"pk": 16,
		"name": "opolskie"
	,{
	"pk": 18,
		"name": "podkarpackie"
		}
	}
	,{
	"pk": 20,
		"name": "podlaskie"
	,{
	"pk": 22,
		"name": "pomorskie"
	,{
	"pk": 24,
		"name": "śląskie"
	,{
	"pk": 26,
		"name": "świętokrzyskie"
	,{
	"pk": 28,
		"name": "warmińsko-mazurskie"
	,{
	"pk": 30,
		"name": "wielkopolskie"
	,{
	"pk": 32,
		"name": "zachodniopomorskie"
		}






//
// EOF
//