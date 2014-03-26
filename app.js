//
//
// SPRAWY-DZIECI - skeleton application with AngularJS
//
// secure app: http://blog.liftsecurity.io/post/37388272578/writing-secure-express-js-apps
//
var ss = require('socketstream')
    , events = require('events')
    , fs = require("fs")
    , cluster = require('cluster')
    , http = require('http')
    , os = require("os")
    , url = require("url")
    , conf = require('./conf')
    , colors = require('colors')
    , mongoose = require('mongoose')
//    , Schema = mongoose.Schema
    , formidable = require('formidable')
    , util = require("util")
    , file_upload = require('./server/lib/file_upload')
    , request = require('request')
    , ServiceUser = require('./server/schema/ServiceUser')
    , allowBrowser = require("./server/lib/check_browser")
    , authom = require("authom")
    , moment = require("moment")
//    , memwatch = require('memwatch')
    , querystring = require("querystring")
    , sendEmail = require("./server/lib/send_email")
    , async = require("async")
    ;

//
// deklaruje emitera zdarzen
var eventEmitter = new events.EventEmitter();    
//
/*
memwatch.on('stats', function(stats) {
    console.log("MEMWATCH: "+stats+"".red);
});
*/

//console.log('>>>'.green + 'dziala colors?'.inverse);
// Define a single-page client
ss.client.define('main', {
  view: 'index.html',
  css:  ['libs'],
  code: ['libs', 'app'], //requires you to make a symlink from ../lib to libs
  tmpl: '*'
});
/*
ss.http.route('/', function(req, res){
    res.serveClient('main');
});
*/
//
// info. dla nieobslugiwanych przegladarek

ss.client.define('changeBrowser', {
  view: 'change_browser.html',
  css:  ['libs'],
  code: [], //requires you to make a symlink from ../lib to libs
  tmpl: '*'
});

ss.http.route('/', function(req, res){
    //console.log("RESP.1");
    //res.serveClient('main');
    
    if (allowBrowser(req, res) ){
	res.serveClient('main');
    } else {
	console.log("redirecting");
	res.writeHead(302, {'Location': '/changebrowser'});
	res.end();
    };
    
/*
    if (req.session && req.session.userId) {
	res.serveClient('main');
    } else {
	console.log("redirecting");
	res.writeHead(302, {'Location': '/login'
	    //add other headers here...
	});
	res.end();
    }
*/
});
//
//
//
ss.http.route('/changebrowser', function(req, res){
    console.log("jestem w /changebrowser");
    res.serveClient('changeBrowser');
});

//
/*
ss.http.route('/login', function(req, res){
    console.log("jestem w /login");
    res.serveClient('main');
});
*/
//
// obsluga potwierdzenia rejestracji w serwise
ss.client.define('SubmitRegistration', {
  view: 'submit_registration.html',
  css:  ['libs'],
  code: ['libs', 'registration'], //requires you to make a symlink from ../lib to libs
  tmpl: '*'
});
ss.http.route('/subreg', function(req, res){
    console.log("jestem w /subreg");
    //console.log("1. req.url= "+JSON.stringify(req.url));
    var params = url.parse(req.url,true);
    //console.log("req.URL= "+util.inspect(params));
    var urlR = '0';
    var urlN = '';
    var qq={};
    console.log("----------------------------------");
    console.log("params.query= "+util.inspect(params.query));
    if (params.query.r===undefined){
	//console.log("Sprawdzam potwierdzenie rejestracji...");
	if (params.query.h && params.query.e){
	    //ServiceUser.findOne({reg_hash:params.query.h, email:String(params.query.e).toLowerCase()}, function(err, user){
	    ServiceUser.findOneAndUpdate({reg_hash:params.query.h, email:String(params.query.e).toLowerCase()},{confirmed:true, confirmed_dt: Date.now(), reg_hash:""}, function(err, user){
		if (err){
		    qq['r']="0";
		} else {	// dodaje parametr r=1 - OK, r=0 - ERR
		    if (user){
			urlR = "1";
			urlN = user.first_name+" "+user.last_name;
		    } else {
			urlR = "2";
		    };
		};
		//console.log("qq="+util.inspect(qq));
		req.url+= "&"+querystring.stringify({r:urlR});
		req.url+= "&"+querystring.stringify({n:urlN});
		//console.log("Przekierowanie na:"+req.url);
		res.writeHead(302, {'Location': req.url});
		res.end();
	    });
	} else {
	    // brak parametrow do sprawdzenia/potwierdzenia rejestracji
	    res.writeHead(302, {'Location': '/'});    
	    res.end();
	};
    } else {
	//console.log("2. req.url= "+JSON.stringify(req.url));
        //console.log("res= "+util.inspect(res));
	res.serveClient('SubmitRegistration');
    };
});
//
// Obsluga przypominania hasla
ss.client.define('PasswordReset', {
  view: 'pswd_reset.html',
  css:  ['libs'],
  code: ['libs', 'reset_password'], //requires you to make a symlink from ../lib to libs
  tmpl: '*'
});
ss.http.route('/pswdreset', function(req, res){
    console.log("jestem w /pswdreset");
    res.serveClient('PasswordReset');
});
//
// Obsluga zaproszenia email dla uzytkownika z zewnątrz
ss.client.define('ConfirmInvitation', {
  view: 'confirm_invitation.html',
  css:  ['libs'],
  code: ['libs', 'reset_password'], //requires you to make a symlink from ../lib to libs
  tmpl: '*'
});
ss.http.route('/coninv', function(req, res){
    console.log("jestem w /coninv");
    //
    var params = url.parse(req.url,true);
    var urlR = '0';
    var qq={};
    console.log("----------------------------------");
    console.log("params.query= "+util.inspect(params.query));
    if (params.query.r===undefined){
	if (params.query.h && params.query.e){
	    ServiceUser.findOneAndUpdate({reg_hash:params.query.h, email:String(params.query.e).toLowerCase()},{confirmed:true, confirmed_dt: Date.now(), pswd_reset_pending:true}, function(err, user){
		if (err){
		    qq['r']="0";
		} else {	// dodaje parametr r=1 - OK, r=0 - ERR
		    if (user){
			urlR = "1";
		    } else {
			urlR = "2";
		    };
		};
		req.url+= "&"+querystring.stringify({r:urlR});
		res.writeHead(302, {'Location': req.url});
		res.end();
	    });
	} else {
	    // brak parametrow do sprawdzenia/potwierdzenia rejestracji
	    res.writeHead(302, {'Location': '/'});    
	    res.end();
	};
    } else {
	res.serveClient('ConfirmInvitation');
    };
});

//
//------------------------------------------------------------------------------
//
// Autentykacja poprzez Facebook i Google 
//
// AUTHOM
authom.createServer({
  service: "google",
  id: conf.google.clientId,
  secret: conf.google.clientSecret,
  scope: ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/calendar","https://picasaweb.google.com/data/"," https://www.google.com/m8/feeds"]
});
authom.createServer({
  service: "facebook",
  id: conf.fb.appId,
  secret: conf.fb.appSecret,
  scope: ['email','publish_stream']
});
//
var addNewUser = require("./server/lib/add_new_user");
//
authom.on("auth", function(req, res, data) {
    //
    req.session.userId = null;
    req.session.save();
    //
    console.log("AUTHOM:: called when a user is authenticated on any service");
    console.log("AUTHOM::"+ util.inspect(data));
    //
    // asynchronicznie czytam najpierw uprawnienia w serwisie "origin_name" i pozniej zapisuje usera
    var userInfo = {
	phone: '',
	origin_perms: '',
	origin_publish: false,
    };
    async.series([
	// przygotowuje dane dla nowego usera
	function(callback){
	    console.log("NEW_USER: 1. przygotowuje dane usera...");

	    if (data.service==='google'){
		userInfo = {
		    first_name: data.data.given_name,
		    last_name: data.data.family_name,
		    name: data.data.name,
		    email: data.data.email,
		    gender: data.data.gender,
		    origin_id: data.data.id,
		    origin_name: 'google',
		    access_token: data.token,
		    born_date: ''
		};
		callback();
	    } else if (data.service==='facebook'){
		userInfo = {
		    first_name: data.data.first_name,
		    last_name: data.data.first_name,
		    name: data.data.name,
		    email: data.data.email,
		    gender: data.data.gender,
		    origin_id: data.data.id,
		    origin_name: 'facebook',
		    access_token: data.token,
		    born_date: data.data.birthday
		};
		// czytam uprawnienia z FB
		request('https://graph.facebook.com/me/permissions/?access_token='+data.token, function (err, response, body) {
		    //console.log("\n\nFB read permissions...\n");
		    if (err) {
			console("ERROR1: pobieranie danych z FB: "+err);
			collaback(err);
		    };
		    if (!err) {
			//console.log(body)
			var bodyJson = JSON.parse(body);
			//console.log(bodyJson)
			if (bodyJson.data){
			    var perms = bodyJson.data[0];
			    userInfo.origin_perms = perms;
			    if (perms.publish_stream || perms.publish_actions){
				userInfo.origin_publish = true;
			    };
			} else if (body['error']) {
			    console("ERROR: pobieranie danych z FB: "+body);
			    //callback(body);
			};
		    };
		    callback();
		});
	    };
	},
	// zapisuje usera do DB
	function(callback){
	    console.log("NEW_USER: 2. zapisuje dane usera...");
	    //
	    addNewUser(userInfo, function(err, newUser){
		if (err) callback(err);
		req.session.userId = newUser._id;
		req.session.save();
		console.log("\n\naddNewUser (2)="+util.inspect(newUser));
		callback();
	    });
	}
    ], function(err){
	if (err) return next(err);
	// emituje event o nowym userze
	eventEmitter.emit("new_user", {"origin_name":userInfo.origin_name, "access_token":userInfo.access_token, "origin_publish": userInfo.origin_publish, "email":userInfo.email})
	// przekierowuje noweg ousera na strone home
	res.writeHead(302, {'Location': '/'});
	res.end();
    });
});

authom.on("error", function(req, res, data) {
    console.log("AUTHOM::called when an error occurs during authentication");
    res.writeHead(302, {'Location': '/'});
    res.end();
});
//
// googleUserMetadata={"id":"100081698741664774275","name":"Dariusz PAWLAK","given_name":"Dariusz","family_name":"PAWLAK","link":"https://plus.google.com/100081698741664774275","gender":"male","locale":"pl"}
//
// Google scopes:
// https://developers.google.com/gdata/faq#AuthScopes
ss.http.route('/auth/google', function(req, res){
    req.params = [];
    req.params.service = 'google';
    authom.app(req, res);
});
ss.http.route('/auth/facebook', function(req, res){
    req.params = [];
    req.params.service = 'facebook';
    authom.app(req, res);
});
ss.http.route('/#_=_', function(req, res){
    res.writeHead(302, {'Location': '/home'});
    res.end();
});
//
// obsluga zdarzenia "new_user"
//
String.prototype.capitalize = function() {
    return this.toLowerCase().charAt(0).toUpperCase() + this.slice(1);
}
eventEmitter.on('new_user', function(event){
    console.log("\n\nJEST NOWY USER: "+util.inspect(event));
    //
    // publikuje w serwisie zewnątrznym
    if (event.origin_publish){
	if (event.origin_name==="facebook"){
	    // wysylam wpis na walla Facebooka
	    var form = {
		access_token: event.access_token,
		message: "Dołączyłem do serwisu RodziceNaCzasie.pl, skupiającego rodziców dzieci w wieku przedszkolnym i szkolnym.\nPrzyłącz się do mnie!",
		link: "http://rnc.rodzicenaczasie.pl",
		name: "RodziceNaCzasie",
		caption: "Przyłącz się do serwisu RodziceNaCzasie.pl",
	    };
	    request.post('https://graph.facebook.com/me/feed', {form:form}, function(err, resp, body){
		if (err) console.log("ERROR= "+err);
		//console.log("RESP= "+util.inspect(resp));
		//console.log("BODY= "+body);
		return true;
	    });    
	};
    };
    //
    // wysyłam mejla do nowego usera
    var now = moment();
    var context = {
	dt: now.format("YYYY-MM-DD HH:mm:ss"),
	origin_name: event.origin_name.capitalize(),
	email: event.email,
    };
    var emailArgs = {
	recipients: [event.email],
	bcc: ['d.pawlak@wurth.pl'],
	subject: "Witamy w serwisie RodziceNaCzasie.pl!",
    };
    //
    sendEmail("new_user_from_outer_space.html", emailArgs, context, function(err, resp){
	if (err) {
	    console.log("Email-errr: "+err);
	} else {
	    console.log("Email was sent.(resp="+resp+")"+ss.env);
	}
    });
});
//
//
//+++++++=++++++++++
//
//var setavat = require("./libs/dwnld_and_set_avatar");
//
ss.http.middleware.prepend(ss.http.connect.bodyParser());
//
//------------------------------------------------------------------------------
//
// Obsługa wysyłania mejli
//
/*
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: conf.gmail.username,
       pass: conf.gmail.password
   }
});
if (os.hostname()!=="franio" && os.hostname()!=="edmo") {
    var now = moment();
    var mailOptions = {
	from: '"Rodzice Na Czasie" <noreply@rodzicenaczasie.pl>',
	to: "pawlakdp@gmail.com",
	subject: "✔ RNC - restart on "+os.hostname()+", at "+now.format("YYYY-MM-DD HH:mm:ss"),
	text: "✔ Restarted at "+now.format("YYYY-MM-DD HH:mm:ss"),
	html: "<p>✔ Restarted at "+now.format("YYYY-MM-DD HH:mm:ss")+"</p>"
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
	if(error){
    	    console.log("GMAIL: "+error);
	} else {
    	    console.log("Message sent: " + response.message);
	}
// if you don't want to use this transport object anymore, uncomment following line
//smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
*/
//
// Obsluga uploadu plikow
//
ss.http.route('/upload', function(req, res){
    if (req.session && req.session.userId) {
	console.log("jestem w /upload - user is authenticated "+req.method);
	file_upload(req, res);
    } else {
        console.log("/upload - Denied Client ");
	res.writeHead(403, {"Content-Type":"text/plain"});
        res.end('403 Forbidden\n');
    }
});
ss.http.route('/upldavt', function(req, res){
    console.log("jestem w /upldavt "+req.method);
    file_upload(req, res);
});
//
//
// Obsluga bazy danych serwisu
// https://github.com/LearnBoost/mongoose
//var mongoose = require('mongoose');
//
mongoose.connect(conf.mongoose_auth, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB'.blue);
});
//
//------------------------
//
// Obsluga sesji w DB
ss.session.options.maxAge = 2.6*Math.pow(10,9);
/*
var	connect = ss.http.connect
    , MongoStore = require('connect-mongo')(connect);
//ss.session.store.use(new MongoStore({db: conf.db.name, host: conf.db.host, port: conf.db.port, username: conf.db.username, password: conf.db.password}));
ss.session.store.use(new MongoStore({url: conf.mongoose_auth}));
*/
ss.session.store.use('redis', {host: conf.redis.host, port: conf.redis.port});
//
//
ss.publish.transport.use('redis', {host: conf.redis.host, port: conf.redis.port});
//
//------------------------------------------------------------------------------
//
// Obsluga sprawdzania czy uzytkownik jest podlaczony
//
/*
var sendUserConnStatus = require('./server/lib/sendUserConnStatus');
sendUserConnStatus(ss.session.userId, true);
//
ss.responders.add(require('ss-heartbeat-responder'), { logging: 1, fakeRedis: true });
ss.api.heartbeat.on('disconnect', function(session) {
    console.log("HEARTBEAT. Client disconnected: "+util.inspect(session));
    sendUserConnStatus(session.user.id, false);
});
ss.api.heartbeat.on('connect', function(session) {
    console.log("HEARTBEAT. Client connected: "+util.inspect(session));
    sendUserConnStatus(session.userId, true);
});
ss.api.heartbeat.on('reconnect', function(session) {
    console.log("HEARTBEAT. Client reconnected: "+util.inspect(session));
    sendUserConnStatus(session.userId, true);
});
setInterval(function() {
    console.log(Date.now());
    
    ss.api.heartbeat.allConnected(function(sessions) {
	console.log("SESSIONS="+util.inspect(sessions))//sessions is an array of all active sessions
	sessions.forEach(function(item){
	    sendUserConnStatus(item.userId, true);
	});
    });
}, 100000);
*/
/*
ss.ws.transport.use('engineio', {
    client: {
	//url: "myDirectServer.url:8080"
        //transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
        transports: ['xhr-polling','websocket','flashsocket']
    }
});
*/

/*
Konfiguracja websocket
ss.ws.transport.use('socketio', {
  client: {
      url: "myDirectServer.url:8080",
          transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
            },
              server: function(io){
                  io.set('log level', 4)
                    }
                    });

   'websocket'
     , 'flashsocket'
       , 'htmlfile'
         , 'xhr-polling'
           , 'jsonp-polling'
*/
/*
ss.ws.transport.use('socketio', {
    client: {
	//url: "myDirectServer.url:8080"
        //transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']
        transports: ['flashsocket']
    }
    ,server: function(io){
	io.set('log level', 3)
    }
});
*/
//ss.ws.transport.use('socketio');
/*
ss.ws.transport.use('socketio', {io: function(io){
    if (ss.env == 'production') {
	io.enable('browser client etag');
        io.set('log level', 1);

	io.set('transports', [
	  'websocket'
//	, 'flashsocket'
	, 'htmlfile'
	, 'xhr-polling'
	, 'jsonp-polling'
	]);
    } else {
	io.enable('browser client etag');
	io.set('log level', 4);
	//io.set('transports', ['websocket', 'flashsocket']);
	io.set('transports', ['websocket', 'xhr-pooling', 'jsonp-polling']);
    }  
}});
*/
//ss.ws.transport.use(require('ss-sockjs'));
/*
ss.ws.transport.use(require('ss-sockjs'), {
  client: {
      debug: true
    },
  server: {
      log: function(severity, message){
        console.log('Custom logger >>>', severity, message);
    }
  }
});
*/
//
// Obsluga poprzez moddleware wysylania plikow statycznych wczytanych przez uzytkownikow.
//
var middSrvImage = require("./server/lib/midd_srvimg");
ss.http.middleware.append(middSrvImage());
//
// Code Formatters
//ss.client.formatters.add(require('ss-less'));
ss.client.templateEngine.use('angular');

//responders
ss.responders.add(require('ss-angular'),{pollFreq: 10000});
// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env == 'production'){
    console.log("TRYB: PRODUCTION");
    ss.client.packAssets();
};
/*
if (os.hostname()==='rncapp' || os.hostname()==="rncapp.rodzicenaczasie.pl"){
    process.env.NODE_ENV = 'production';
    ss.env = "production";
    ss.client.packAssets();
};
*/
//
if (ss.env == 'development') {
    //
    // zdalna konsola w trybie devel
    var consoleServer = require('ss-console')(ss);
    consoleServer.listen(5000);
};
//
// Obsluga duzego obciazenia
//
var toobusy = require('toobusy');
ss.http.middleware.use(function(req, res, next) {
    if (toobusy()) {
	console.log("toobusy !!!");
	//res.send(503, "I'm busy right now, sorry.");
	res.writeHead(503, {'Content-Type': 'text/plain'});
	res.end("I'm busy right now, sorry.");
    } else {
	next();
    }; 
});
//
// --->>>
//
//var appGuard = require("./app_guard");
//ss.http.middleware.append(appGuard());
//
// <<<---
//
//
//var clusterMode = "cluster";
var clusterMode = "clusterless";
//
// Definuje server
//
var server = http.Server(ss.http.middleware);
//
// Start with cluster
//
if (clusterMode === "cluster"){
if (cluster.isMaster) {
    /*
    if (os.hostname()==='rncapp.rodzicenaczasie.pl' || os.hostname()==="rncapp"){
	var serversNum = 2;
    } else {
	var serversNum = os.cpus().length /2;
    };
    */
    //var serversNum = os.cpus().length /2;
    var serversNum = 1;
    console.log(' Start servers: '.blue + serversNum + ' (half of total CPU cores number) '.blue);
    for (var i = 0; i < serversNum; i++) {
	var worker = cluster.fork();
    }

	//
	// Listen for dying workers
	// https://github.com/rowanmanning/learning-express-cluster/blob/master/app.js
	cluster.on('exit', function (worker) {
	    console.log('Worker ' + worker.id + ' died :(');
	    cluster.fork();
	});
	//
    } else {
	console.log(' | RodziceNaCzasie.pl - clustered | '.inverse);
	server.listen(3001);
	ss.start(server, function(){
	    process.setuid(conf.uid);
	    process.setgid(conf.gid);
	});
    }
} else {
    //
    // BEZ CLUSTER
    //
    console.log(' | RodziceNaCzasie.pl  - without cluster | '.inverse);
    //var server = http.Server(ss.http.middleware);
//    server.listen(3000, '127.0.0.1');
    server.listen(3001);
    ss.start(server);
}
//
// ---
//
process.on('uncaughtException', function (err) {
    if (os.hostname()==='rncdev'){
	var now = moment();
        var context = {
	    dt: now.format("YYYY-MM-DD HH:mm:ss"),
	    err: err+' \n '+err.stack,
	};
	var emailArgs = {
	    recipients: ['d.pawlak@wurth.pl', 'pawlakdp@gmail.com','marianwr@gmail.com'],
	    //recipients: ['pawlakdp@gmail.com'],
	    subject: "RNC ERROR on "+os.hostname()+", at "+now.format("YYYY-MM-DD HH:mm:ss"),
	};
	//
/*
	sendEmail("rnc_error_report.html", emailArgs, context, function(err, resp){
	    if (err) {
    		console.log("Email-errr: "+err);
	    } else {
    		console.log("Email was sent.(resp="+resp+")"+ss.env);
	    }
	});
*/
    };
  console.log('ERR (uncaught) ', err, "\n", err.stack);
});
//------------------------------------------------------------------------------
//
// wyslanie mejla z info, ze jest restart serwera
if (os.hostname()==='rncdev'){
    var now = moment();
    var context = {
	dt: now.format("YYYY-MM-DD HH:mm:ss"),
    };
    var emailArgs = {
	recipients: ['d.pawlak@wurth.pl', 'pawlakdp@gmail.com','marianwr@gmail.com'],
	subject: "✔RNC - restart on "+os.hostname()+", at "+now.format("YYYY-MM-DD HH:mm:ss"),
    };
    //
/*
    sendEmail("rnc_restart.html", emailArgs, context, function(err, resp){
	if (err) {
    	    console.log("Email-errr: "+err);
	} else {
    	    console.log("Email was sent.(resp="+resp+")"+ss.env);
	}
    });
*/
};
//
// EOF
//
