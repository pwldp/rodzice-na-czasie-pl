//
// Definicja modelu: rodzic dziecka
//
// level okresla:
// 0 - jest głownym rodzicem dziecka; ma wszelkie prawa do danych dziecka
// 1 - ma podglad danych dziecka
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , util = require("util")
    ;
//
//==============================================================================
var KidsParentSchema = new Schema({
    kid_id: { type: Schema.Types.ObjectId, ref: 'Kid' },
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    level: { type: Number, required: true, default: 0 },
    confirmed: {type: Boolean, required: false, default: true},
    confirmed_dt: {type: Date, required: false },
    kids: [{
	kid_id: { type: Schema.Types.ObjectId, ref: 'Kid' },
	level: { type: Number, required: true, default: 0 },
	confirmed: {type: Boolean, required: false, default: true},
	confirmed_dt: {type: Date, required: false },
    }]
});
//
//==============================================================================
KidsParentSchema.pre('save', function(next) {
    //
    if (this.isModified('confirmed')){
	this.confirmed_dt = Date.now();
    };
    //
    next()
});
//
//
KidsParentSchema.statics.isUsersKid = function(user_id, kid_id, cb){
    console.log("KidsParentSchema.statics.isAccessibleByUser("+user_id+","+kid_id+")");
    this.findOne({user_id:user_id, 'kids.kid_id': kid_id, confirmed: true })
    .select("_id kids.kid_id")
    .exec(function(err, rtn) {
	if (err) return cb(err, null);
	//console.log("rtn="+util.inspect(rtn))
	if (rtn){
	    return cb(null, true);
	} else {
	    return cb(null, false);
	};
    });
};
//
//
//
module.exports = mongoose.model('KidsParent', KidsParentSchema);
//
// EOF
//