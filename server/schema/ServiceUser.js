//
// Definicja modelu do obslugi uzytkownikow serwisu
//
// Kod sciagniety z: 
// * http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
// *http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
//
//
//==============================================================================
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , bcrypt = require('bcrypt')
    , uuid = require('node-uuid')
    , crypto = require('crypto')
    , conf = require("../../conf")
    , nodemailer = require("nodemailer")
    , path = require('path')
    , emailTemplates = require('swig-email-templates')
    , moment = require("moment")
    , util = require("util")
    , sendEmail = require("../lib/send_email")
    , SALT_WORK_FACTOR = 10
    // these values can be whatever you want - we're defaulting to a
    // max of 10 attempts, resulting in a 24 hour lock
    , MAX_LOGIN_ATTEMPTS = 10
    , LOCK_TIME = 24 * 60 * 60 * 1000
    ;
//
//==============================================================================
var ServiceUserSchema = new Schema({
    id: { type: String, required: false, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: false, index: { unique: true } },
    password: { type: String, required: true },
    first_name: { type: String, required: false},
    last_name: { type: String, required: false },
    email: { type: String, required: true, lowercase:true, trim:true, index: { unique: true } },
    phone: { type: String, required: false },
    gender: { type: String, required: false, lowercase:true, trim:true, },
    born_date: { type: Date, required: false },
    avatar_id: { type: Schema.Types.ObjectId, ref: 'FileMetaInfo' },
    origin_name: { type: String, required: false, default: 'manual' },		// w jaki sposób zarejestrowal sie w RNC: google, facebook, manual
    origin_id: { type: String, required: false, default: '' },			// ID w serwisie "origin_name", z ktorego sie zalogowal/zarejetsrowal
    origin_perms: { type:Schema.Types.Mixed, required:false},
    origin_publish: {type: Boolean, required: false, default: false },		// czy RNC moze publikowac w imieniu uzytkownika na serwisie "origin_name"
    access_token: { type:String, required:false, default:"" },			// token dostepu do publikowania/laczenia sie z serwisem z "origin_name"
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
    last_activity: { type: Date, required: false, default: Date.now },
    deleted: {type: Boolean, required: false, default: false },
    deleted_dt: { type: Date, required: false, default: Date.now },
    confirmed: {type: Boolean, required: false, default: false },
    confirmed_dt: { type: Date, required: false, default: Date.now },
    created_dt: { type: Date, required: false, default: Date.now },
    city_id: { type: Schema.Types.ObjectId, ref: 'City' },
    address: { type: String, required: false },
    postcode: { type: String, required: false },
    reg_hash: { type: String, required: false },
    pswd_reset_pending: {type: Boolean, required: false, default: false},	// czy aktualnie trwa oczekwianie na reset hasła
    pswd_reset_pending_end_dt: { type: Date, required: false },		// do kiedy jest aktywny link
});
//
// //==============================================================================
ServiceUserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});
//
//==============================================================================
ServiceUserSchema.pre('save', function(next) {
    var user = this;
    var now = moment();
    this._wasnew = this.isNew;
    this.sendEmailAfterNewUserRegister = false;
    this.sendEmailAfterPasswordChange = false;
    console.log("Save user:", user.username);
    // spr. czy uzytkownik zalozony w zwiazku z zaproszeniem
    if (this.origin_name==="invitation"){
	var addInfo = JSON.parse(this.reg_hash);
	console.log("JEST INVITATION="+util.inspect(addInfo));
	this.invit_type = addInfo.inv_type;	// [user_by_teacher, next_parent]
	if (this.invit_type==="user_by_teacher" || this.invit_type==="next_parent"){
	    this.sender = addInfo.sender;
	    this.kid = addInfo.kid;
	};
    };
    //
    if (this.isNew) {
	this.username = this.email.toLowerCase();
	this.confirmed = false;
	this.reg_hash = crypto.createHash('sha1').update(uuid.v1()).digest("hex");
	console.log("Hash:"+this.reg_hash)
	var originList = ["manual","invitation"];
	if (originList.indexOf(this.origin_name)<0){
	    this.confirmed = true
	    this.sendEmailAfterNewUserRegister = true;
	};
    } else {
	this.username = this.username;
    };
    if (this.pswd_reset_pending===true){
	console.log("Reset password request.");
	this.reg_hash = crypto.createHash('sha1').update(uuid.v1()).digest("hex");	// dla bezpieczenstwa niech sie zmienia
	this.last_activity = now.format("YYYY-MM-DD HH:mm:ss");
	this.pswd_reset_pending_end_dt = now.add('hours', 24).format("YYYY-MM-DD HH:mm:ss");
    };
    //
    if (this.origin_name==='manual'){
	this.origin_id=this._id;
    };
    //
    if (this.name==="" || this.name===undefined){
	this.name= this.first_name+" "+this.last_name;
    };
    //
    if (this.gender!=='male' && this.gender!=='female'){
	this.gender = 'unknown';
    };
    //
    this.id = this._id;
    //
    if (user.isModified('email')) {
	user.email = user.email.toLowerCase();
    };
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    console.log("SAVE:: jest zmiana hasla"+this.password+","+user.password)
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	if (err) return next(err);
	// hash the password using our new salt
	bcrypt.hash(user.password, salt, function(err, hash) {
	    if (err) return next(err);
	    // override the cleartext password with the hashed one
	    user.password = hash;
	    user.sendEmailAfterPasswordChange = true;
	    console.log("SAVE:: nowe haslo="+user.password);
	    next();
	});
    });
});
//
ServiceUserSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log("comparePassword="+this.password);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	if (err) return cb(err);
	console.log("comparePassword="+this.password);
	cb(null, isMatch);
    });
};
//
ServiceUserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
	return this.update({
	    $set: { loginAttempts: 1 },
	    $unset: { lockUntil: 1 }
	}, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
	updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};
// expose enum on the model, and provide an internal convenience reference 
var reasons = ServiceUserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2,
    REG_NEED: 3
};
//
ServiceUserSchema.statics.getAuthenticated = function(username, password, cb) {
    console.log("getAuthenticated.0, username="+username);
    this.findOne({username:username, deleted:false }, function(err, user) {
	if (err) return cb(err);
	//console.log("getAuthenticated.1");
	// make sure the user exists
	if (!user) {
	    return cb(null, null, reasons.NOT_FOUND);
	}
        //console.log("getAuthenticated.2");                                      
	// check if the account is currently locked
	if (user.isLocked) {
	    // just increment login attempts if account is already locked
    	    return user.incLoginAttempts(function(err) {
    		if (err) return cb(err);
        	return cb(null, null, reasons.MAX_ATTEMPTS);
    	    });
	}
	//console.log("getAuthenticated.3");
	// czy potwierdzil rejestracje
	if (!user.confirmed){
	    return cb(null, null, reasons.REG_NEED);
	};
	//console.log("getAuthenticated.4");
	// test for a matching password
	user.comparePassword(password, function(err, isMatch) {
	    if (err) return cb(err);
	    //console.log("getAuthenticated.5="+password);                                                                                                                                                                        
    	    // check if the password was a match
    	    if (isMatch) {
    		// if there's no lock or failed attempts, just return the user
        	if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
        	// reset attempts and lock info
        	var updates = {
        	    $set: { loginAttempts: 0 },
		    $unset: { lockUntil: 1 }
		};
		return user.update(updates, function(err) {
		    if (err) return cb(err);
		    return cb(null, user);
		});
	    }

    	    // password is incorrect, so increment login attempts before responding
    	    user.incLoginAttempts(function(err) {
		if (err) return cb(err);
    		return cb(null, null, reasons.PASSWORD_INCORRECT);
	    });
	});
    });
};
//
ServiceUserSchema.post('save', function(next) {
    var user = this;
    //console.log("Po zapisie usera, czy nowy user:"+user._wasnew+util.inspect(user));
    var tmplName = "";
    var nowDT = moment().format("YYYY-MM-DD HH:mm");
    if(user._wasnew) {
	//
	// http://www.scotchmedia.com/tutorials/express/authentication/3/02
	// http://howtonode.org/sending-e-mails-with-node-and-nodemailer
	//
	var cntxt = {
	    adremail: user.email,
	    dt: nowDT,
	    reg_url: "http://rnc.rodzicenaczasie.pl/coninv?h="+user.reg_hash+"&e="+user.email,
	};
	var ea = {
	    recipients: user.email,
	};
	if (user.origin_name==="invitation"){
	    console.log("EMAIL: potwierdzenie ZAPROSZONEJ rejestracji w RNC, typu:"+user.invit_type);
	    if (user.invit_type==="next_parent"){
		// zaproszenie dodania kolejnego rodzica/opiekuna do dziecka
		tmplName = "invite_next_parent.html";
		cntxt['sender'] = user.sender;
		cntxt['kid'] = user.kid;
		cntxt['reg_url']+= "&type=kidparent";
		ea['subject'] = "RodziceNaCzasie.pl - Zaproszenie do serwisu dla rodzica/opiekuna."
	    } else if (user.invit_type==="user_by_teacher"){
		// zaproszenie rodzica przez nauczyciela do dodania dziecka do klasy
		tmplName = "invite_user_by_teacher.html";
		cntxt['sender'] = user.sender;
		cntxt['kid'] = user.kid;
		cntxt['reg_url']+= "&type=kidclass";
		ea['subject'] = "RodziceNaCzasie.pl - Zaproszenie do serwisu przez nauczyciela."
	    };
	    // wysylam mejla
	    if (tmplName!=="" && ea && cntxt){
		sendEmail(tmplName, ea, cntxt, function(err, resp){
		    if (err) return console.error(err);
		    return true;
		});
	    };
	} else {
	    // nie wysylam tego linku jezeli user przychodzi z GM lub FB
	    if (!user.sendEmailAfterNewUserRegister){
		console.log("EMAIL: link aktywacyjny do potwierdzenia rejestracji");
		var ea = {
		    recipients: user.email,
		    subject: "RodziceNaCzasie.pl - Potwierdzenie rejestracji."
		};
		var cntxt={
			last_name: user.last_name,
			first_name: user.first_name,
			reg_url:"http://rnc.rodzicenaczasie.pl/subreg/?h="+user.reg_hash+"&e="+user.email,
		    };
		sendEmail("registration_confirm_link.html", ea, cntxt, function(err, resp){
		    if (err) return console.error(err);
		    return true;
		});
	    };
	};
    } else {;
	//
	// email po potwierdzeniu nowego usera
	if (user.sendEmailAfterNewUserRegister){
	    var cntxt = {
		adremail: user.email,
		dt: nowDT,
		reg_url: "http://rnc.rodzicenaczasie.pl/coninv?h="+user.reg_hash+"&e="+user.email,
	    };
	    var ea = {
		recipients: user.email,
	    };
	    
	    console.log("EMAIL: potwierdzenie NORMALNEJ rejestracji w RNC");
	    var ea = {
		recipients: user.email,
		subject: "RodziceNaCzasie.pl - Witamy w serwisie."
	    };
	    var cntxt = {
		first_name: user.first_name,
		adremail: user.email,
		dt: nowDT,
	    };
	    tmplName = "registration_welcome_new_user.html";

	    // wysylam mejla
	    if (tmplName!=="" && ea && cntxt){
		sendEmail(tmplName, ea, cntxt, function(err, resp){
		    if (err) return console.error(err);
		    return true;
		});
	    };
	};
	//
	// email po zmianie hasla
	if (user.sendEmailAfterPasswordChange){
	    console.log("EMAIL: potwierdzenie zmiany hasla:"+util.inspect(user));
	    
	    var ea = {
		recipients: user.username,
		subject: "RodziceNaCzasie.pl - Potwierdzenie zmiany hasła."
	    };
	    var cntxt = {
		first_name: user.first_name,
		dt: nowDT,
	    };
	    sendEmail("reset_password_confirmation.html", ea, cntxt, function(err, resp){
		if (err) return console.error(err);
		return true;
	    });
	};
    };
});
//
module.exports = mongoose.model('ServiceUser', ServiceUserSchema);
//
// EOF
//