//
// Funkcje do obsługi rejestracji uzytkownika
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var ServiceUser = require("../schema/ServiceUser")
    //, mongoose = require('mongoose')
    , moment = require("moment")
    , util = require("util")
    , os = require("os")
    , sendEmail = require("../lib/send_email")
    ;
//
var userDataExclude = "-password -reg_hash -confirmed -confirmed_dt -deleted -deleted_dt -pswd_reset_pending -pswd_reset_pending_end_dt -origin_name -origin_id -loginAttempts -__v -_v";
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    //req.use('user.checkAuthenticated');	- bez sprawdzania czy user jest zalogowany
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Register..." );
    //
    return {
	//
	// Zarejestrowanie nowego uzytkownika w RNC
	//
	newUser: function( sObj ){
	    console.log("registerUser("+util.inspect(sObj)+")...");

	    if (sObj!==undefined) {
		if (!sObj.first_name || !sObj.last_name || !sObj.email || !sObj.pswd){
		    return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':{'reason':'arguments'}} );
		} else {
		    sObj.email = sObj.email.toLowerCase();
		    //
		    ServiceUser
		    .findOne({email: sObj.email})
		    .select(userDataExclude)
		    .exec(function(err, fObj){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
			if (fObj) {
			    res( {'ret': 'ERR', 'msg': 'Użytkownik o podanym adresie email już istnieje', 'res':{'reason':'email'}} );
			} else {
			    fObj = new ServiceUser();
			    fObj.first_name = sObj.first_name;
			    fObj.last_name = sObj.last_name;
			    fObj.name = sObj.first_name+" "+sObj.last_name;
			    fObj.email = sObj.email;
			    fObj.username = sObj.email;
			    fObj.password = sObj.pswd;
			    fObj.save(function(err){
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
				return res( {'ret':'OK', 'msg':'', 'res':fObj} );
			    });
			};
		    });
		};
	    } else {
		res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru', 'res':{'reason':'db'}} );
	    };
	},
	//
	// Wyslanie linku do ustawienia nowego hasła
	//
	pswdResetInvitation: function(email){
	    console.log("pswdResetInvitation("+email+")...");
	    //
	    if (!email || email===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru.', 'res':{'reason':'arguments'}} );
	    };
	    ServiceUser
	    //.findOneAndUpdate({email: email.toLowerCase(), confirmed:true},{pswd_reset_pending:true})
	    .findOne({email: email.toLowerCase(), confirmed:true})//,{pswd_reset_pending:true})
	    //.select(userDataExclude)
	    .exec(function(err, user){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
		//
		//console.log("pswdResetInvitation-user="+util.inspect(user));
		if (user){
		    user.pswd_reset_pending = true;
		    user.username = email.toLowerCase();
		    user.save(function(err){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
			//console.log("pswdResetInvitation - jest user wysylam mejla"+util.inspect(user)+", len="+user.length);
			var ea = {
			    recipients: user.email,
			    subject: "RodziceNaCzasie.pl - Ustawienie nowego hasła."
			};
			var reg_url = "http://rnc.rodzicenaczasie.pl/pswdreset/?h="+user.reg_hash+"&e="+user.email; 
			if (os.hostname()==="franio" || os.hostname()==="edmo") {
			    reg_url = "http://10.89.4.194:8080/pswdreset/?h="+user.reg_hash+"&e="+user.email;     
			};
			var now = moment();
			cntxt = {
			    first_name: user.first_name,
			    adremail: user.email,
			    dt: now.format("YYYY-MM-DD HH:mm"),
			    reg_url: reg_url,
			    link_end_dt: now.add("hours",24).format("YYYY-MM-DD HH:mm"),
			};
			sendEmail("reset_password", ea, cntxt, function(err, resp){
			    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'smtp'}} );
			    return res( {'ret':'OK', 'msg':'', 'res':true} );
			});
		});
		} else {
		    return res( {'ret': 'ERR', 'msg': 'Użytkownik o podanym adresie email nie istnieje', 'res':{'reason':'email'}} );
		};
	    });
	},
	//
	// Wyslanie linku do ustawienia nowego hasła
	//
	pswdResetSubmit: function(hash, email, pswd){
	    console.log("pswdResetSubmit("+hash+","+email+","+pswd+")...");
	    //res( {'ret': 'ERR', 'msg': 'pswdResetSubmit() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    if (!hash || !email || !pswd){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':{'reason':'arguments'}} );
	    };
	    if (hash===undefined || email===undefined || pswd===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':{'reason':'arguments'}} );
	    };
	    //
	    var now = moment();
	    //
	    ServiceUser
	    .findOne({email: email.toLowerCase(), reg_hash:hash, pswd_reset_pending:true})
	    //.findOneAndUpdate({email: email.toLowerCase(), reg_hash:hash, pswd_reset_pending:true},{pswd_reset_pending:false, pswd_reset_pending_end_dt:now.format("YYYY-MM-DD HH:mm:ss")})
	    .select("_id pswd_reset_pending pswd_reset_pending_end_dt password username email first_name last_name")
	    .exec(function(err, user){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
		//
		//console.log("pswdResetSubmit - jest user:"+util.inspect(user));
		//
		if (user){
		    user.username = email.toLowerCase();
		    user.password = pswd;
		    user.pswd_reset_pending = false;
		    user.pswd_reset_pending_end_dt = now.format("YYYY-MM-DD HH:mm:ss");
		    user.save(function(err){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
			return res( {'ret':'OK', 'msg':'', 'res':true} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono podanego żądania zmiany hasła.', 'res':[]} );
		};
	    });
	},
	//
	// Potwierdzenie zaproszenia ze zmiana hasla dla zaproszonego usera
	//
	confInvPswd: function(hash, email, pswd, confirm){
	    console.log("confInvPswd("+email+","+pswd+")...");
	    if (!hash || !email || !pswd || !confirm){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':{'reason':'arguments'}} );
	    };
	    if (hash===undefined || email===undefined || pswd===undefined || confirm===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':{'reason':'arguments'}} );
	    };
	    //
	    ServiceUser
	    .findOne({email: email.toLowerCase(), reg_hash:hash, pswd_reset_pending:true})
	    //.findOneAndUpdate({email: email.toLowerCase(), reg_hash:hash, pswd_reset_pending:true},{pswd_reset_pending:false, pswd_reset_pending_end_dt:now.format("YYYY-MM-DD HH:mm:ss")})
	    //.select("_id pswd_reset_pending pswd_reset_pending_end_dt password username email first_name last_name")
	    .exec(function(err, user){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
		//
		if (user){
		    user.username = email.toLowerCase();
		    user.password = pswd;
		    user.pswd_reset_pending = false;
		    user.pswd_reset_pending_end_dt = Date.now();
		    user.confirmed = true;
		    user.confirmed_dt = Date.now();
		    user.save(function(err){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':{'reason':'db'}} );
			return res( {'ret':'OK', 'msg':'', 'res':true} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono zaproszenia.', 'res':[]} );
		};
	    });
	},
    };	// do return
}
//res( {'ret': 'ERR', 'msg': '() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
// EOF
//