#!/usr/bin/env nodejs
var os = require("os")
    , sendEmail = require("./send_email")
    , moment = require("moment")
    ;
console.log("Wysylam testowego mejla...");

var now = moment();
var context = {
    dt: now.format("YYYY-MM-DD HH:mm:ss"),
};
var emailArgs = {
    recipients: ['pawlakdp@gmail.com',"d.pawlak@wurth.pl"],
    subject: "✔RNC - email testowy from "+os.hostname()+", at "+now.format("YYYY-MM-DD HH:mm:ss"),
};
//
sendEmail("test_email.html", emailArgs, context, function(err, resp){
    if (err) {
	console.log("Email-errr: "+err);
	return err
    } else {
        console.log("Email was sent.(resp="+resp+")");
	return resp
    }
});

//
// EOF
//