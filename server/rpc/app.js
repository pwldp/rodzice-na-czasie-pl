//
// Takie rozne pomocnicze badziewia
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var util = require("util")
    , moment = require("moment")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.getUserLists');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_app..." );
    //
    return {
    	getsess: function() {
    	    console.log("getsess(), SESSION="+util.inspect(req.session));
    	    res(util.inspect(req.session));
	}
  };
}
