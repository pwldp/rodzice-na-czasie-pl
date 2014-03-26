exports.auth = function() {
    return function(req, res, next) {
	console.log("server::middleware::client.js -> check user is auth");
	if(req.session && req.session.userId) {
	    console.log("server::middleware::client.js -> auth? =="+req.session.userId);
    	    return next();
	} else {
	    console.log("server::middleware::client.js -> auth? == NO");
	}
	//res(false);
	res( {ret: 'ERR', msg:'User not authorized'} );
    }
}
