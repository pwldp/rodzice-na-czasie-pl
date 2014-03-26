//
// test funkcji rpc_Registration
//
// http://wekeroad.com/2012/02/25/testing-your-model-with-mocha-mongo-and-nodejs/
//
var ass = require('socketstream');
var util = require('util');
var ss = ass.start();

var usrEmail = "user@test.dom";
var usrPswd = "secretpswd";

describe('rpc_Registration.newUSer', function(){

    it('should register new user', function(done){
    this.timeout(15000);
	ss.rpc('rpc_Registration.newUser', {"first_name":"Adam","last_name":"Nowak","name":"","email":usrEmail,"pswd":usrPswd}, function(ret){
	    console.log("typeof ret = "+typeof ret);
	    //var doc = JSON.parse(ret);
	    var doc = ret[0];
	    console.log("RET="+util.inspect(doc));//.should.equal('true');
	    console.log("RET= "+doc.ret);//.should.equal('true');
	    
	    if (doc.ret==='ERR'){
		console.log("RPC function returned: "+doc.msg);
		doc.ret.should.not.equal("ERR");
	    } else {
		doc.ret.should.not.equal("OK");
		doc.email.should.equal(userEmail);
    		doc.password.should.not.equal("password");
	    };
    	    done();
	});
    });
});