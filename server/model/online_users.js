//des describes the model and has the middleware
//chan is a channel on which to post the updated model object

exports.make = function(des,chan,ss) {
  des.use('session')
  des.use('client.auth');
  
    return {
	//must have a poll function for now. may have other update models
	poll: function(p) {
    	    var counter = (new Date()).getTime();
    	    var obj = {
    		online_users: counter
    	    };
        chan(obj);
	}
    };
};
