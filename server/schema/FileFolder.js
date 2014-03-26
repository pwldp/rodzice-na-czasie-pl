//
// Definicja modelu do przechowywania danych o zawartosci folderow plikow
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2012.12.03
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    ;
//
//==============================================================================
var FileFolderSchema = new Schema({
    id: {type: String, required:false, index: {unique:true} },
    parent_folder: { type: ObjectId, ref: 'FileFolder', index: { unique: false} },
    owner: { type: ObjectId, ref: 'ServiceUser', index: { unique: false} },
    name: {type: String, required: true, index: { unique: false} },
    folder_type: {type: String, required: true, index: { unique: false} },	// ['root','normal']
    size: { type: Number, required: true, default: 0},
    //path: {type: String, required: true, index: { unique: false} },
    upload_dt: {type: Date, required: false, index: { unique: false}, default: Date.now() },
    folders: [{ type: ObjectId, ref: 'FileFolder', index: {unique: true} }],
    files: [{ type: ObjectId, ref: 'FileMetaInfo', index: {unique: true} }],
    shared: {type:Boolean, required:false, default:false },
});
//
//
/*
FileFolderSchema.pre('save', function(next) {
    this.id = this._id;
    next();
});
*/
//
//
FileFolderSchema.statics.getRootFolder = function(user_id, cb) {
    console.log("FileFolderSchema.statics.getRootFolder("+user_id+")");
    FileFolder.findOne({owner:user_id, folder_type:"root"}, function(err, rootFolder){
	if (err) return cb(err);
	//
	if (!rootFolder){
	    var rootFolder = new FileFolder();
	    rootFolder.owner = user_id;
	    rootFolder.name = "root";
	    rootFolder.folder_type = "root";
	    rootFolder.save(function(err){
		if (err) return cb(err);
		//
		return cb(null, rootFolder);
	    });
	} else {
	    return cb(null, rootFolder);
	};
    });
};
//
//
var FileFolder = mongoose.model('FileFolder', FileFolderSchema);
module.exports = FileFolder;
//
// EOF
//