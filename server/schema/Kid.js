//
// Definicja modelu: dziecko
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    , slugify = require('slug')
    ;
//
//==============================================================================
//var emptyVoiv = 
var KidSchema = new Schema({
    id: {type: String, required: false, index: { unique: false } },
    'first_name': {type: String, required: true, index: { unique: false } },
    'last_name': {type: String, required: true, index: { unique: false } },
    slug_name: {type: String, required: false, index: { unique: false } },
    'born_date': {type: Date, required: false, index: { unique: false }, default: null },
    'gender': {type: String, required: true, default: null },
    'avatar_id': { type: Schema.Types.ObjectId, ref: 'MetaFileInfo' },
    'address': { type: String, required: false, default: '' },
    'zipcode': { type: String, required: false, index: { unique: false }, default: '' },
    'city_id': { type: Schema.Types.ObjectId, ref: 'City' },
    'phone': { type: String, required: false, default: '' },
    'email': { type: String, required: false, default: '' }, //, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
    'note': { type: String, required: false, default: '' },
    parent_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },
    creation_dt: {type: Date, required: false, default: Date.now() },
    edited_dt: {type: Date, required: false, default: Date.now() },
    deleted: {type: Boolean,required:false, default:false},
    deleted_dt: {type: Date, required: false, default: Date.now() },
});
//
//==============================================================================

KidSchema.pre('save', function(next) {
    this.id = this._id;
    this.slug_name = slugify(this.first_name.replace(" ","").toLowerCase()+this.last_name.replace(" ","").toLowerCase())
    this.edited_dt = Date.now();
    next()
});
//
//
//
module.exports = mongoose.model('Kid', KidSchema);
//
// EOF
//