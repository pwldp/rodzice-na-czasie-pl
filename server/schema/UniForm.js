//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ServiceUSer = require("../schema/ServiceUser")
    ;
//
//==============================================================================
var UniFormSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , cnt: { type: String, required: true }
    , cntxt: { type: String, required: true }					// kontekst w jakim użyto formularza
    , cr_dt: {type: Date, required: false, default: Date.now()}
    , cat:{ type: String, required: true }	// student, teacher, school class, 
});
    
//
module.exports = mongoose.model('UniForm', UniFormSchema);
//
// EOF
//