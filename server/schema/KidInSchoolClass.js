//
// Definicja modelu: typy szkół
//
//
//==============================================================================
var mongoose = require("mongoose")
    , Schema = mongoose.Schema
    , ServiceUser = require("../schema/ServiceUser")
    , ServiceGroup = require("../schema/ServiceGroup")
    , Kid = require("../schema/Kid")
    , util = require("util")
    ;
//
//==============================================================================
//var emptyVoiv = 
var KidInSchoolClassSchema = new Schema({
    kid: { type: Schema.Types.ObjectId, ref: 'Kid', index: { unique: false } }
    , school_class: { type: Schema.Types.ObjectId, ref: 'ServiceGroup', index: { unique: false } }
    , added_by_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } }
    , added_by_user_type: { type: String, required: true }
    , creation_dt: {type: Date, required: true, default: Date.now()}
    , edited_dt: {type: Date, required: false }
    , confirmed: {type: Boolean, required: false, default: true }
    , confirmed_dt: { type: Date, required: false, default: Date.now() }
    , deleted: {type: Boolean, required: false, default: false }
    , deleted_dt: { type: Date, required: false, default: Date.now() }
});
//
//==============================================================================
KidInSchoolClassSchema.pre('save', function(next) {
    this.edited_dt = Date.now();
    next();
});
//
//==============================================================================
//
var KidInSchoolClass = mongoose.model('KidInSchoolClass', KidInSchoolClassSchema);
module.exports = KidInSchoolClass;
//
// EOF
//