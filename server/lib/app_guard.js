//
// https://github.com/jaredhanson/connect-ensure-login/blob/master/lib/ensureLoggedIn.js
//

var redirect = require('response-redirect');
//
module.exports = function guard(options) {
/*
  options = options || {};
  var value = options.value || defaultValue;

  return function(req, res, next){
    // generate CSRF token
    var token = req.session._csrf || (req.session._csrf = utils.uid(24));

    // ignore these methods
    if ('GET' == req.method || 'HEAD' == req.method || 'OPTIONS' == req.method) return next();

    // determine value
    var val = value(req);

    // check
    if (val != token) return next(utils.error(403));
    
    next();
  }
*/ 
    return function (req, res, next) {
	console.log("MIDDLEWARE: url="+req.url);
	console.log("MIDDLEWARE: session="+JSON.stringify(req.session));
        if (req.session && req.session.userId) {
    	    console.log("MIDD: user is authenticated, do nothing");
    	    next();
        } else if (req.url.toLowerCase()!=="/login") {
    	    console.log("MIDD: user NOT authenticated");
	    res.statusCode = 302;
	    res.setHeader('Location', '/login');
	    res.setHeader('Content-Length', '0');
	    res.end();
	    return
        }
    }
};

//
// EOF
//