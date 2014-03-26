//
// Obsluga wysylania waidomosci email z konta noreply@rodzicenaczasie.pl
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.01.14
//
// http://howtonode.org/sending-e-mails-with-node-and-nodemailer
//
//
console.log("__dirname="+__dirname);
//
var conf = require("../../conf")
    , nodemailer = require("nodemailer")
    , path = require('path')
    , emailTemplates = require('swig-email-templates')
    , util = require("util")
    , os = require("os")
    ;
//
//EMAIL_SENDER = '"RodziceNaCzasie.pl" <noreply@rodzicenaczasie.pl>'
//
//
/*
var smtpTransport = nodemailer.createTransport("SMTP",{
var defaultTransport = nodemailer.createTransport('SMTP', {
 service: 'Gmail',
 auth: {
   user: conf.gmail.username,
   pass: conf.gmail.password
 }
});
*/
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "localhost",
//    debug: true
});
//
/*
emailArgs {
  subject: temat mejla
  recipients: lista odbiorcow
}    
*/
module.exports = function sendEmail(templateName, emailArgs, context, cb) {
    console.log("__dirname="+__dirname);
    var options = {
	//root: "../server/templates",
	//root: path.join(__dirname.replace("libs",""), "server/templates"),
	root: path.join(__dirname.replace("/lib",""), "/templates"),
    };
    //
    emailTemplates(options, function(err, render, generateDummy) {
	render(templateName, context, function(err, html) {
	    console.log("context="+util.inspect(context));
	    if (err) return cb(err);
	    // send html email
	    //console.log("html="+html);
	    //
	    var mailOptions = {
		from: '"✔RodziceNaCzasie.pl" <noreply@rodzicenaczasie.pl>',
		to: emailArgs.recipients,
		subject: ''+emailArgs.subject,
		html: html,
		generateTextFromHTML: true,
	    };
	    //
	    if (os.hostname()==="franio" || os.hostname()==="edmo") {
		mailOptions['to'] = ["pawlakdp@gmail.com","d.pawlak@wurth.pl"];
		mailOptions['subject'] = "RNC::DEV - "+mailOptions['subject'];
	    };
	    //
	    smtpTransport.sendMail(mailOptions, function(err, response){
		if(err) return cb(err)
		console.log("Message sent: " + response.message);
		return cb(null, response);
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	    });
	    
	});

    });
    
};
//
// EOF
//