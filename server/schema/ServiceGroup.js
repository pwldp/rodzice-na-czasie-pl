//
// Definicja modelu do obslugi grup uzytkownikow w serwisie.
//
var ss = require("socketstream")
    , mongoose = require('mongoose')
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , Schema = mongoose.Schema
    , slugify = require('slug')
    ;
//
//==============================================================================
var ServiceGroupSchema = new Schema({
      name: { type: String, required: true, index: { unique: false } }
    , id: { type: String, required: false }
    , slug: { type: String, required: false, index: { unique: false } }
    , user_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }	// uzytkownik, ktory zalozyl grupe
    , owner_id: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }	// uzytkownik, ktory jest wlascicielem grupy
    , school_info: {
	'school_type_id': { type: Schema.Types.ObjectId, ref: 'SchoolType' },
	'school_type': {type: String, required: false, index: { unique: false } },
	'group_id': { type: Schema.Types.ObjectId, ref: 'ServiceGroup' },
	'slug': { type: String, required: false, index: { unique: false } },
	'address': { type: String, required: false },
	'postcode': { type: String, required: false, index: { unique: false } },
	'voivodeship_id': { type: Schema.Types.ObjectId, ref: 'Voivodeship' },
	'voivodeship': { type: String, required: false, index: { unique: false } },
	'city_id': { type: Schema.Types.ObjectId, ref: 'City' },
	'city': { type: String, required: false, index: { unique: false } },
	'phone': { type: String, required: false, index: { unique: false } },
	'www': { type: String, required: false },
	'email': { type: String, required: false }, //, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
	'note': { type: String }
    }
    , school_year: { type: String, required: false, index: { unique: false } }		// podaje pierwszy rok da lroku szkolnego, ktorego dotyczy nazwa klasy
    , upper_group_id: {type:Schema.Types.ObjectId,ref:'ServiceGroup',index:{unique:false}}	// grupa nadrzedna; jezeli jest klasa to musi byc wypelnione na ID grupy szkoly
    , moderators: [{ type: Schema.Types.ObjectId, ref: 'ServiceUser' }]
    , creation_dt: {type: Date, required: true, default: Date.now()}
    , edited_dt: {type: Date, required: false }
    , group_type: { type: String, required: false, index: { unique: false } }	// [private, friends, teachers, school, school_class, other???]
    , deleted: {type: Boolean, required:false, default: false }
    , deleted_dt: {type: Date, required:false}
});
//
var groupTypes = ["private", "friends", "teachers", "school", "school_class", "other"];
//
//==============================================================================
ServiceGroupSchema.pre('save', function(next) {
    var item = this;
    item._wasNew = item.isNew;
    console.log("Save group:", item.name);
    // only hash the password if it has been modified (or is new)
    if (!item.isModified('name')) return next();
    // zmieniona nazwa wiec zmieniam slug'a
    item.slug = slugify(item.name.toLowerCase());
    //
    if (this.owner_id === undefined ) {
	this.owner_id = this.user_id;
    };
    //
    if (this.id === undefined ) {
	this.id = this._id;
    };
    //
    this.edited_dt =  Date.now();
    //
    if (this.group_type === undefined ) {
	item.group_type='private';
    } else {
	if (this.group_type.length===0) item.group_type='private';
    };
    //
    next()
    //
});
//
//==============================================================================
ServiceGroupSchema.post('save', function(next) {
    console.log("ServiceGroupSchema.post.save...");
    var grp = this;
    if (grp._wasNew){
	if (grp.user_id!==grp.inviting_user && grp.accepted===false){
	    // to chyba zaproszenie wiec wysylam powiadomienie do zapraszanego usera
	    console.log("ServiceGroupSchema.post.save... inviting.");
	    var msg = {id:grp._id};
	    ss.api.publish.user(item, 'grpinvit', msg);
	};
    };
});
//
//==============================================================================
ServiceGroupSchema.statics.checkExistsUsersFriendsGroup = function(user_id, cb){
    console.log("checkExistsUsersFriendsGroup("+user_id+")...");
    this.findOne({owner_id: user_id, group_type: 'friends' }, function(err, groupInfo) {
	//
	if (err) return cb(err);
	//
	// jezeli nie ma grupy typu 'friends' to ja zakladam
	if (!groupInfo) {
	    groupInfo = new ServiceGroup();
	    groupInfo.name = "Znajomi";
	    groupInfo.user_id = user_id;
	    groupInfo.owner_id = user_id;
	    groupInfo.group_type = 'friends';
	    groupInfo.save(function(err){
		if (err) return cb(err);
		//
		// dopisuje wlasciciela do swojej grupy 'friends'
		var sgm = ServiceGroupMember();
		sgm.group_id = groupInfo._id;
		sgm.user_id = groupInfo.owner_id;
		sgm.inviting_user = groupInfo.owner_id;
		sgm.accepted = true;
		sgm.save(function(err){
		    if (err) return cb(err);
		    return cb(null, groupInfo);
		});
	    }); // do groupInfo.save()
	} else {
	    return cb(null, groupInfo);
	}
    });
};
//
//==============================================================================
var ServiceGroup  = mongoose.model('ServiceGroup', ServiceGroupSchema);
//
module.exports = ServiceGroup;
//
// EOF
//