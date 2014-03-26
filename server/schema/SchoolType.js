//
// Definicja modelu: typy szkół
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , slugify = require('slug')
    ;
//
//==============================================================================
//var emptyVoiv = 
var SchoolTypeSchema = new Schema({
    pk: {type: Number, required: true, index: { unique: true } },
    name: { type: String, required: true, index: { unique: false } },
    slug: { type: String, required: false, index: { unique: false } },
    type: { type: String, required: true, index: { unique: false } },
    popularity: {type: Number, required: false, default: 0}
});
//
//==============================================================================
SchoolTypeSchema.pre('save', function(next) {
    var item = this;
    //if (!item.isModified('name')) return next();
    item.slug = slugify(item.name.toLowerCase());
    next()
});
//
//
//
module.exports = mongoose.model('SchoolType', SchoolTypeSchema);
//
// EOF
//