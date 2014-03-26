//
// Przekierowuje na /home gdy po zalogowaniu przez Facebook jest sciecka "#_=_"
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.02.20
//
//
var url = require("url")
//
module.exports = function redirectBadFBPath(options) {
    //-- start --
    return function (req, res, next) {
	if (req.session && req.session.userId) {
	    var params = url.parse(req.url, true)	
	    //if (params.pathname==="/image" && req.method==="GET" )
	    console.log("params.pathname="+params.pathname);
	};
	next();
    };
    //-- stop --
};

//
// EOF
//