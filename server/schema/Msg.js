//
// Obsługa wiadomości 
//
var ss = require("socketstream")
    , mongoose = require("mongoose")
    , ServiceUser = require("../schema/ServiceUser")
    , MsgFolder = require("../schema/MsgFolder")
    , Schema = mongoose.Schema
    , util = require("util")
    ;
//==============================================================================
var MsgSchema = new Schema({
    id: { type: String, required: false }
    , author: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique: false} }
    , recipients: [{ type: Schema.Types.ObjectId, ref: 'ServiceUser', index: {unique:false} }]
    , created_dt: {type: Date, required: true, default: Date.now(), index: {unique:false}}
    , thread_id: { type: Schema.Types.ObjectId, ref: 'Msg', index: {unique: false} }
    , title: { type: String, required: false, index: { unique: false } }
    , content: { type: String, required: true, index: { unique: false } }
    //, has_attachments: { type:Boolean, required:false, default:false}
    , atts: [ {type:Schema.Types.Mixed, required:false} ]
});
//
//==============================================================================
MsgSchema.pre('save', function(next) {
    this._wasNew = this.isNew;
    if (this.id === undefined ) {
	this.id = this._id;
    };
    //
    if (this.isNew && !this.thread_id){
	this.thread_id = this._id;
	if (this.title===undefined){
	    this.title="";
	};
    };
    //
    next();
});
//
//==============================================================================
MsgSchema.post('save', function(next) {
    console.log("MsgSchema.post.save()...");
    var msg = this;
    if (msg._wasNew){
	//console.log("Zapisuje odbiorcow.");
	// dodaje nadawce do listy odbiorcow
	if (msg.recipients.indexOf(msg.author)<0){
	    msg.recipients.push(msg.author);
	};
	//
	msg.recipients.forEach(function(item){
	    //console.log("-->"+item);
	    MsgFolder.findOne({msg:msg._id,owner:item}, function(err, mf){
		if (err) console.log("Msg.POST.Save.MsgFoldererror:"+err);
		if (!mf){
		    var mf = new MsgFolder();
		    mf.msg = msg._id;
		    mf.owner = item;

		    if (String(item)===String(msg.author)){
			mf.folder = "outbox";
			mf.status = 'read';
			mf.status_change_dt = Date.now();
		    } else {
			mf.folder = "inbox";
		    };

		    mf.save(function(err){
			if (err) console.log("Msg.POST.Save.error:"+err);
			// wysylam po WebSocket
			//console.log("\n\nWysylam MSG po WebSocket.");
			var nmsg = {
			    id: msg._id,
			    tid: msg.thread_id,
			    athr: msg.author,
			    tle: msg.title,
			    cnt: msg.content,
			    fld: mf.folder,
			    sts: msg.status,
			    cdt: msg.created_dt,
			    del: msg.deleted,
			    del_dt: msg.deleted_dt
			};
			//console.log("Wysylam MSG po WebSocket."+util.inspect(nmsg));
			ss.api.publish.user(item, 'msg', nmsg);
		    });
		};
	    });
	});
    };
});
//
//==============================================================================
var Msg  = mongoose.model('Msg', MsgSchema);
//
module.exports = Msg;
//
// EOF
//