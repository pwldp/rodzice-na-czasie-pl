//
// Definicja modelu: typy szkół
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    ;
//
//==============================================================================
//
var SchoolSubjectSchema = new Schema({
    id: { type:String, required:false, index:{unique: false } },
    name: { type: String, required: true, index: { unique: false } },
    descr: { type: String, required: false, index: { unique: false } },
    abbr: { type: String, required: false, index: { unique: false } },
    user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser' },		// przedmioty ogólnie dostepne nie maja ustawionego user_id
    cat: { type: String, required: true, index: { unique: false } },	// typ przedmiotu, jeden z: [prv, std, meal, reg, other]
});
//
//==============================================================================
//
SchoolSubjectSchema.pre('save', function(next) {
    this.id = this._id;
    if (this.cat===undefined || this.cat==""){
	this.cat = 'prv';
    };
    next();
});
//
module.exports = mongoose.model('SchoolSubject', SchoolSubjectSchema);
//
// EOF
//