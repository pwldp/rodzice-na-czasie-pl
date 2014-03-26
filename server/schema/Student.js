//
// Definicja modelu: uczeń
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    ;
//
//==============================================================================
//var emptyVoiv = 
var StudentSchema = new Schema({
    'first_name': {type: String, required: true, index: { unique: false } },
    'last_name': {type: String, required: true, index: { unique: false } },
    'born_date': {type: Date, required: false, index: { unique: false }, default: Date.now() },
    'gender': {type: String, required: true, default: null },
    'avatar': {type: String, required: false, default: null },
    'address': { type: String, required: false },
    'zipcode': { type: String, required: false, index: { unique: false } },
    'city_id': { type: Schema.Types.ObjectId, ref: 'City' },
    'phone': { type: String, required: false, index: { unique: false } },
    'email': { type: String, required: false }, //, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
    'note': { type: String }    
});
//
//==============================================================================
/*
SchoolSchema.pre('save', function(next) {
    var item = this;
    if (!item.isModified('name')) return next();
    item.slug = slugify(item.name.toLowerCase());
    next()
});
*/
//
//
//
module.exports = mongoose.model('Student', StudentSchema);
//
// EOF
//