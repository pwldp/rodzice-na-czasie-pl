//
// Definicja modelu: wojewodztwa
//
// Kod sciagniety z: 
// * http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
// * http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    , Voivodeship = require("./Voivodeship")
    , County = require("./County")
    ;
//
//==============================================================================
//var emptyVoiv = 
var CitySchema = new Schema({
    name: {type: String, required:true, index:{unique:false} },
    slug: {type: String, required:false, index:{unique:false} },
    teryt: {type: String, required:false, index:{unique:false} },
    teryt_woj: {type: String, required:false, index:{unique:false} },
    teryt_pow: {type: String, required:false, index:{unique:false} },
    teryt_gmi: {type: String, required:false, index:{unique:false} },
    teryt_rodz_gmi: {type: String, required:false, index:{unique:false} },
    voiv_id: {type: ObjectId, ref: 'Voivodeship', index:{unique:false} },
    voiv_name: {type: String, required:false, index:{unique:false} },
    county_name: {type: String, required:false, index:{unique:false} },
    county_id: {type: ObjectId, ref: 'Voivodeship', index:{unique:false} },
    has_school: false,
});
//
//
//
CitySchema.methods.upsert = function( data ) {
//CitySchema.statics.upsert = function( data ) {
    this.findOne({pk: data.pk}, function(err, item) {
	var oper = '';
	if(!err) {
	    if(!item) {
		item = new CitySchema();
		i//tem = mongoose.model('City', CitySchema);
		item.pk = data.pk;
		oper = 'created and saved';
	    } else {
		oper = 'updated';
	    }
	    if (item.name !== data.name ) {
		item.name = data.name;
		item.save(function(err) {
		    if(!err) {
			console.log("CitySchema "+ oper +" (pk:" + data.pk + ",name: " + data.name + ")");
		    }
		    else {
			console.log("Error: could not save CitySchema, pk: " + data.pk);
		    }
		});
	    }
	}
    });
};
//
CitySchema.statics.findByPK = function( itemPK ){
    this.findOne({"pk": itemPK}, function(err, item) {
	if (err){
	    return null;
	} else {
	    //console.log("jest miasto:",itemPK,", item="+item);
	    //return item
	    next(item);
	}
    });
};



//
module.exports = mongoose.model('City', CitySchema);
//
// EOF
//