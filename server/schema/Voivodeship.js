//
// Definicja modelu: wojewodztwa
//
// Kod sciagniety z: 
// * http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
// * http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
//
//
//==============================================================================
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//
//==============================================================================
var VoivodeshipSchema = new Schema({
    'name': { type: String, required: true, index: { unique: true } },
    'pk': { type: Number, required: true, index: { unique: true } }	// to pole musi byc aby poprawnie wczytac i zsynchronizowac wojewodztwa z miastami
});
//
//
//VoivodeshipSchema.methods.upsert = function( data ) {
VoivodeshipSchema.statics.upsert = function( data ) {
    this.findOne({pk: data.pk}, function(err, item) {
	var oper = '';
	if(!err) {
	    if(!item) {
		item = new VoivodeshipSchema();
		//item.pk = data.pk;
		oper = 'created and saved';
	    } else {
		oper = 'updated';
	    }
	    if (item.name !== data.name ) {
		item.name = data.name;
		item.save(function(err) {
		    if(!err) {
			console.log("VoivodeshipSchema "+ oper + ",name: " + data.name + ")");
		    }
		    else {
			console.log("Error: could not save VoivodeshipSchema, pk: " + data.pk);
		    }
		});
	    }
	}
    });
};
//
VoivodeshipSchema.statics.getVoivodeshipByPK = function(itemPK) {
    return this.findOne({pk: itemPK}, function(err, item) {
	//console.log("("+itemPK+") item woj=",item);
    	//if (err) return cb(err);
    	//console.log("err=", err);
    	//if (err) return cb(null, null);
	//cb(null, item);
    });
    
     /*
     return this.model('User').findOne({
             username: login, 
                 }, function(err, user){
                         if (!err) return user;
                                 else console.log("failed to authenticate", err);
     }).exec(cb);
     */
};
//
module.exports = mongoose.model('Voivodeship', VoivodeshipSchema);
//
// EOF
//