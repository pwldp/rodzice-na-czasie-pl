//
// Definicja modelu do przechowywania informacji o plikach i folderach uzytkownika
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = mongoose.Schema.ObjectId
    , FileMetaInfo = require("../schema/FileMetaInfo")
    , util = require('util')
    ;
//
//==============================================================================
var FileUserInfoSchema = new Schema({
    user_id: { type: ObjectId, ref: 'ServiceUser', index:{unique:true} },
    size_limit: { type:Number, required:false, default:104857600 }, // czyli 100MB w bajtach = 1024*1024*100
    size_current: { type:Number, required:false, default:0 },
    root_folder: { type:ObjectId, ref:'FileFolder', index:{unique:true} },
    last_upload: {type: Date, default: Date.now()}
});
//
FileUserInfoSchema.statics.updateSizesInfo = function(user_id, cb) {
    //console.log("updateSizesInfo("+user_id+")...");
    var thisInfo = this;
    FileMetaInfo.getFilesSizeSum(user_id, function(err, countSize){
	if (err) {
	    return cb(err);
	} else {
	    //console.log("getFilesSizeSum::Szukam userInfo");
	    thisInfo.findOne({user_id: user_id}, function(err, userInfo){
		if (err) {
		    return cb(err);
		} else {
		    //console.log("getFilesSizeSum:: userInfo="+userInfo);
		    if (!userInfo) {
			console.log("Zakladam FIleUSerInfo dla userId="+user_id);
			var fui = mongoose.model('FileUserInfo', FileUserInfoSchema);
			var newInfo = new fui();
			newInfo.user_id = user_id;
			newInfo.size_current = countSize;
			console.log("newInfo="+newInfo);
			newInfo.save();
			return cb(null, newInfo);
		    } else {
			userInfo.size_current = countSize;
			userInfo.save();
			return cb(null, userInfo);
		    }
		}
	    });
	}
    });
};
//
/*
FileUserInfoSchema.statics.addNew = function(user_id, cb) {
    
});
*/
//
FileUserInfoSchema.statics.getSizesInfo = function(user_id, cb) {
    //console.log("object="+util.inspect(user_id));
    this.findOne({user_id: user_id}, function(err, userInfo){
	//console.log("err="+err+", user_id="+user_id);
	if (err) {
	    return cb(err);
	} else {
	    //console.log("getSizesInfo:: userInfo="+userInfo);
	    if (!userInfo) {
		//console.log("Zakladam FIleUSerInfo dla userId="+user_id);
		/*
		var newInfo = new this({
		    user_id: user_id,
		    size_current: 0
		});
		console.log("newInfo="+newInfo);
		newInfo.save();
		*/
		var fui = mongoose.model('FileUserInfo', FileUserInfoSchema);
		var newInfo = new fui();
		newInfo.user_id = user_id;
		newInfo.size_current = 0;
		console.log("newInfo="+newInfo);
		newInfo.save();
		return cb(null, newInfo);
	    } else {
		return cb(null, userInfo);
	    }
	}
    });
};
//
/*
FileUserInfoSchema.statics.getFilesSizeSum = function(user_id, cb) {
    this.find({user_id: user_id}, function(err, itemList){
	if (err) return cb(err);
	console.log("items="+itemList);
	var sizeCount = 0;
	itemList.forEach(function(item){
	    console.log("item.name="+item.name);
	    sizeCount+=item.fsize;
	});
	console.log("sizeCount="+sizeCount);
	return cb(null, sizeCount)
    });
};
*/
//
module.exports = mongoose.model('FileUserInfo', FileUserInfoSchema);
//
// EOF
//