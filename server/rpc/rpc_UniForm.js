//
// Obsluga schematu School i nie tylko
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var UniForm = require('../schema/UniForm')
    , moment = require("moment")
    , util = require("util")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    //req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_UniForm..." );
    //
    //
    return {
	//
	// Zapis formularza kontaktowego
	//
	save: function(sObj) {
	    console.log("save()="+util.inspect(sObj));
	    if (sObj===undefined || sObj.cnt===undefined || sObj.cat===undefined || sObj.cntxt===undefined ){
		return res( {'ret':'ERR', 'msg':"Brak wymaganych parametrów.", 'res':[]} );
	    };
	    if (sObj.cat!=="contact" && !req.session.userId){
		return res( {'ret':'ERR', 'msg':"Musisz być zalogowany.", 'res':[]} );
	    };
	    var uf = new UniForm();
	    if (sObj.cat==="contact"){
		uf.user = null;
	    } else {
		uf.user = req.session.userId;
	    };
	    uf.cnt = sObj.cnt;
	    uf.cntxt = sObj.cntxt;
	    uf.cat = sObj.cat;
	    uf.save(function(err){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		return res( {'ret':'OK', 'msg':"", 'res':uf} );
	    });
	},

    };	// do return
}
//
// EOF
//