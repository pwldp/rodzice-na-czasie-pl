//
// Obsluga zaproszen do serwisu
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.01.14
//
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ServiceUser = require("../schema/ServiceUser")
    , ServiceGroup = require("../schema/ServiceGroup")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , sendEmail = require("../lib/send_email")
    , moment = require("moment")
    , uuid = require('node-uuid')
    , crypto = require('crypto')
    ;
//
//==============================================================================
var InvitationSchema = new Schema({
    inviting_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } },	// zapraszajacy
    invited_user: { type: Schema.Types.ObjectId, ref: 'ServiceUser', index: { unique: false } },		// zaproszony, jezeli jest juz zarejestrowany
    email: { type: String, required: false, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/ },
    creation_dt: {type: Date, required: false, index: {unique: false}, default: Date.now()},
    iuid: { type: String, required: false , index: {unique: true}}, // invitation unique ID
    accepted: { type: Boolean, required: false, default: false},
    accepted_dt: { type: Date, required: false, default: Date.now()}
});
//
//==============================================================================
//
InvitationSchema.pre('save', function(next) {
    console.log("InvitationSchema.pre.save:"+this.email)
    this._wasnew = this.isNew;
    if (this._wasnew){
	this.iuid = crypto.createHash('sha1').update(uuid.v1()).digest("hex");
    };
    //
    if (this.isModified('accepted') && this.accepted){
	this.accepted_dt = Date.now();
    };
    //
    next();
});
//
//==============================================================================
//
InvitationSchema.post('save', function(next){
    var invit = this;
    console.log("InvitationSchema.post.save:"+invit.email)
    if(invit._wasnew) {
	// spr. czy uzytkownik o podanym email jest w RNC
	ServiceUser.findOne({email:invit.email}, function(err, user){
	    if (err) return console.error(err);
	    //
	    console.log("CZY JEST JUZ user?");
	    if (user){
		// jezeli jest juz taki user to zapraszam go do znajomych wysylajacego
		console.log("Jest JUZ user wiec zaprszam do znajomych!");
		// spr. czy zapraszajacy user ma grupe 'friends'
		ServiceGroup.checkExistsUsersFriendsGroup(invit.inviting_user, function(err, sgFriends){
		    if (err) return console.error(err);
		    //
		    console.log("checkExistsUsersFriendsGroup...");
		    //
		    ServiceGroupMember.findOne({user_id: invit.inviting_user, group_id:sgFriends._id}, function(err, groupMember){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			// jezeli nie znalazl
			if (!groupMember) {
			    var sgm = ServiceGroupMember();
			    sgm.group_id = sgFriends._id;
			    sgm.user_id = user._id;
			    sgm.inviting_user = invit.inviting_user;
			    sgm.accepted = false;
			    sgm.save(function(err){
				console.log("Zapisale mzaproszenie do znajomych");
				if (err) return console.error("ERR:"+err);
				return true;
			    });
			} else {
			    console.log("JUZ JEST w znajomych");
			    //return res( {'ret':'ERR', 'msg': 'Brak dostępu', 'res':[]} );
			    if (err) return console.error("ERR:"+err);
			    return true;	       
			};
		    });	// do ServiceGroupMember.findOne
		});	// do ServiceGroup.checkExistsUsersFriendsGroup
	    } else {
		console.log("CZY JEST JUZ user - NIE MA?");
		// nie ma jeszcze takiego usera wiec wysylam mejla
		//
		// najpierw odczytuje dane zapraszajacego
		ServiceUser.findById(invit.inviting_user, function(err, invUser){
		    if (err) return console.error(err);
		    //
		    if (invUser){
			console.log("Wysylam mejla do:"+invit.email);
			var ea = {
			    recipients: invit.email,
			    subject: "♥RodziceNaCzasie.pl - Zaproszenie."
			};
			var now = moment();
			var cntxt = {
			    sender: invUser.first_name+" "+invUser.last_name,
			    reg_url: "http://rnc.rodzicenaczasie.pl/",
			    dt: now.format("YYYY-MM-DD HH:mm"),
			};
			sendEmail("invite_new_user.html", ea, cntxt, function(err, resp){
			    if (err) return console.error(err);
			    return true;
			});
		    } else {
			if (err) return console.error("Nie znaleziono zapraszającego?");
		    };
		});	// do ServiceUser.findById
	    };
	});	// do ServiceUser.findOne
    };
    return true;
});
//
//==============================================================================
//
module.exports = mongoose.model('Invitation', InvitationSchema);
//
// EOF
//