//
// Plik konfiguracyjny dla RNC
//
//
var ss = require("socketstream")
    , os = require("os");
console.log("SERVER HOSTNAME: "+os.hostname());
//
rnc_conf =  {
    fb: {
        appId: 'xx'
      , appSecret: 'xx'
    }
    ,google: {
	clientId: '152419076680.apps.googleusercontent.com'
	, clientSecret: 'fCTgTALx84x610NCLvYMCtGz'
    }
    , gmail: {
	username: "noreply@xxxxx.pl",
	password: "xxxxx"
    }
    ,db: {
	name: 'rnc_production',
	host: 'xxx.xxx.xxx.xxx',
	port: 27017,
	username: 'uuuuu',
	password: 'ppppp'
    }
    //,.g. mongodb://username:server@mongoserver:10059/somecollection
    , mongoose_auth: 'mongodb://uuuuu:ppppp@xxx.xxx.xxx.xxx.:27017/rnc_production'
    , redis: {
	host: "212.160.117.246",
	port: 6379
    }
    ,filesDir: __dirname+"/file_storage"
    , thumb: {width: 60, height: 60}
    , uid: 'madateam'
    , gid: 'madateam'
};
//
if (os.hostname()==='rncdev') {
    //
    // Redis
    rnc_conf.redis.host = "127.0.0.1";
    rnc_conf.redis.port = 6379;
    //
    // MongoDB
    rnc_conf.db.name = 'rnc_production';
    rnc_conf.db.host = '127.0.0.1';
    rnc_conf.db.port = 27017;
    rnc_conf.db.username = 'uuuuu';
    rnc_conf.db.password = 'ppppp';
    //
    rnc_conf.mongoose_auth = 'mongodb://uuuuu:ppppp@127.0.0.1:27017/rnc_production'
};
//
//
console.log("MongoDB database: "+rnc_conf.db.name+"@"+rnc_conf.db.host);
//
module.exports = rnc_conf;
//
// EOF
//