//
// Obsluga dla SchoolTimeTable
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Invitation = require('../schema/Invitation')
    , ServiceUser = require('../schema/ServiceUser')
    , Kid = require('../schema/Kid')
    , Notification = require('../schema/Notification')
    //, checkAccess_User2Kid = require("../lib/user_funcs").checkAccess_User2Kid()
    , KidsParent = require('../schema/KidsParent')
    , util = require("util")
    , moment = require("moment")
    , uuid = require('node-uuid')
    , async = require("async")
    , validateEmail = require("../lib/validateEmail")
    ;
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Invitation..." );
    //
    return {
	//
	// Zapisanie listy adresow email do wyslania zaproszen
	//
	sendInvitation: function( emails_list ) {
	    console.log("sendInvitation('"+emails_list+"')...");
	    if (emails_list && emails_list.length>0) {
		// tworze liste zvalidowanych adresow email
		var validEmails = [];
		emails_list.forEach(function(item){
		    email = item.toLowerCase();
		    if (validateEmail(email)){
			validEmails.push( {email:email, userid:req.session.userId} );
		    };
		});
		// zapisuje mejle
		async.each(validEmails, saveInvitedEmail, function(err){
		    // if any of the saves produced an error, err would equal that error
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    return res( {'ret':'OK', 'msg':'', 'res':[]} );
		});
	    } else {;
		return res( {'ret': 'ERR', 'msg':"Brak adresów email do wysłania zaproszeń.", 'res':[]} );
	    };
	},
	//
	// Zaproszenie dla nastepnego rodzica
	//
	inviteNextParent: function(kid_id, inv_email){
	    //res( {'ret': 'ERR', 'msg': '() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    console.log("inviteNextParent('"+inv_email+"')...");
	    if (kid_id===undefined || inv_email===undefined){
		return res( {'ret':'ERR', 'msg':"Brak wymaganych parametrów.", 'res':[]} );
	    };	
	    if (!validateEmail(inv_email)){
		return res( {'ret':'ERR', 'msg':"Podany adres email jest niepoprawny.", 'res':[]} );
	    };
	    // czy aktualny user ma dostep do dziecka
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		if (rtn) {
		    // ma dostep i moze wysylac zaproszenia dla innych rodzicow
		    // spr. czy jest user z podanym adersem email
		    ServiceUser
		    .findOne({$or:[{username:inv_email},{email:inv_email}]})
		    .exec(function(err, user){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			console.log("userInfo:"+util.inspect(user));
			if (user) {
			    // jest użytkownik, wiec zwracam jego ID
			    return res( {'ret':'OK', 'msg':'', 'res':{user_id: user._id, existed:true, first_name:user.first_name, last_name:user.last_name,confirmed:user.confirmed}} );
			} else {
			    // dodatkowe informacje dla schematu ServiceUser, czytam dane dziecka
			    Kid
			    .findOne({_id:kid_id})
			    .select("id first_name last_name")
			    .exec(function(err, kidInfo){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				//
				console.log("kidInfo="+util.inspect(kidInfo));
				if (kidInfo){
				    var addInfo = {
					inv_type: "next_parent",
					sender: req.session.user.first_name+" "+req.session.user.last_name,
					kid: kidInfo.first_name+" "+kidInfo.last_name,
				    };
				    // nie ma uzytkownika, wiec zaklada mu najpierw konto
				    var user = new ServiceUser();
				    user.first_name = 'nieznane';
				    user.last_name = 'nieznane';
				    user.email = inv_email;
				    user.username = inv_email;
				    user.name = 'nieznane';
				    user.origin_name = 'invitation';
				    user.confirmed = false;
				    user.password = uuid.v1();
				    user.reg_hash = JSON.stringify(addInfo);	// przenosi info. o typie zaproszenia
				    user.save(function(err){
					if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
					return res( {'ret':'OK', 'msg':'', 'res':{user_id: user._id, existed:false, first_name:'', last_name:'',confirmed:user.confirmed}} );	
				    });
				} else {
				    if (err) return res( {'ret':'ERR', 'msg':"Nie znaleziono podanego dziecka.", 'res':[]} );
				};
			    });
			};
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':"Nie masz dostępu do danych dziecka.", 'res':[]} );
		};
	    });
	},
	//
	// Zaproszenie wywysłane przez nauczyciela w momencie zapisania dziecka do klasy
	//
	inviteUserByTeacher: function(kid_first_name, kid_last_name, inv_email){
	    console.log("inviteUserByTeacher('"+inv_email+"')...");
	    if (kid_first_name===undefined || kid_last_name===undefined || inv_email===undefined){
		return res( {'ret':'ERR', 'msg':"Brak wymaganych parametrów.", 'res':[]} );
	    };
	    if (!validateEmail(inv_email)){
		return res( {'ret':'ERR', 'msg':"Podany adres email jest niepoprawny.", 'res':[]} );
	    };
	    // spr. czy jest user z podanym adersem email
	    ServiceUser
	    .findOne({$or:[{username:inv_email},{email:inv_email}]})
	    .exec(function(err, user){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		//console.log("userInfo:"+util.inspect(user));
		if (user) {
		    // jest użytkownik, wiec zwracam jego ID
		    return res( {'ret':'OK', 'msg':'', 'res':{user_id: user._id, existed:true, first_name:user.first_name, last_name:user.last_name,confirmed:user.confirmed}} );
		} else {
		    // dodatkowe informacje dla schematu ServiceUser, czytam dane biezacego usera czyli nauczyciela
		    var addInfo = {
			inv_type: "user_by_teacher",
			sender: req.session.user.first_name+" "+req.session.user.last_name,
			kid: kid_first_name+" "+kid_last_name,
		    };
		    // nie ma uzytkownika, wiec zaklada mu najpierw konto
		    var user = new ServiceUser();
		    user.first_name = 'nieznane';
		    user.last_name = 'nieznane';
		    user.email = inv_email;
		    user.username = inv_email;
		    user.name = 'nieznane';
		    user.origin_name = 'invitation';
		    user.confirmed = false;
		    user.password = uuid.v1();
		    user.reg_hash = JSON.stringify(addInfo);	// przenosi info. o typie zaproszenia
		    user.save(function(err){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			return res( {'ret':'OK', 'msg':'', 'res':{user_id: user._id, existed:false, first_name:'', last_name:'',confirmed:user.confirmed}} );	
		    });
		};
	    });
	},
	
    };
};
//
function saveInvitedEmail(args, cb){
    console.log("saveInvitedEmail="+util.inspect(args));
    Invitation.findOne({email:args['email'], inviting_user:args['userid']}, function(err, foundInvit){
	if (err) return cb(err);
	// jezeli beizacy user nie wyslal jeszcze zaproszenia pod dany email to je zapisuje
	if (!foundInvit){
	    console.log("Zapisuje zaproszenie.");
	    var invit = new Invitation();
	    invit.email = args['email'];
	    invit.inviting_user = args['userid'];
	    invit.save(function(err){
		if (err) return cb(err);
		return cb(null, true);
	    });
	} else {
	    console.log("Nie zapisuje zaproszenia.");
	    return cb(null, true);
	};
    });
};
//
// EOF
//