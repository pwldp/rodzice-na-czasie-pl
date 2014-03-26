//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ServiceUSer = require("../schema/ServiceUser")
    ;
//
//==============================================================================
var ContactFormSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , content: { type: String, required: true }
    , context_descr: { type: String, required: true }					// kontekst w jakim użyto formularza
    , creation_dt: {type: Date, required: false, default: Date.now()}
});
    
//
module.exports = mongoose.model('ContactForm', ContactFormSchema);
//
// EOF
//