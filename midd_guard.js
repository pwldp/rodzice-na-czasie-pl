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
    return function bodyParser(req, res, next) {
	console.log("MIDDLEWARE: url="+req.url);

	next();
    }
};

