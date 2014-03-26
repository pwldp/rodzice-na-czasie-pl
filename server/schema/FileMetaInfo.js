//
// Definicja modelu do przechowywania danych o pliku
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2012.11.30
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    ;
//
//==============================================================================
var FileMetaInfoSchema = new Schema({
    user_id: { type: ObjectId, ref: 'ServiceUser', index: { unique: false} },
    name: {type: String, required: true, index: { unique: false} },
    basename: {type: String, required: true, index: { unique: false} },
    ext: {type: String, required: false, index: { unique: false} },
    fsize: { type: Number, required: true, default: 0},
    mimetype: {type: String, required: true, index: { unique: false} },
    path: {type: String, required: true, index: { unique: false} },
    upload_dt: {type: Date, required: false, index: { unique: false}, default: Date.now() },
    has_thumbnail: {type: Boolean, required: true, default: false },
    hash: {type: String, required: true, index: { unique: false} },
});
//
FileMetaInfoSchema.statics.getFilesSizeSum = function(user_id, cb) {
    this.find({user_id: user_id}, function(err, itemList){
	if (err) return cb(err);
	//console.log("items="+itemList);
	var sizeCount = 0;
	itemList.forEach(function(item){
	    console.log("item.name="+item.name);
	    sizeCount+=item.fsize;
	});
	//console.log("sizeCount="+sizeCount);
	return cb(null, sizeCount)
    });
};
//
//
//
//
module.exports = mongoose.model('FileMetaInfo', FileMetaInfoSchema);
//
// EOF
//