//
// Obsluga dla SchoolTimeTable
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var  ServiceUser = require('../schema/ServiceUser')
    , Notification = require('../schema/Notification')
    , util = require("util")
    , moment = require("moment")
    ;
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Notification..." );
    //
    return {
	//
	// Zwraca listę powiadomien bieżącego użytkownika
	//
	getNotifications: function(status) {
	    console.log("getNotifications("+status+")...");
	    //res( {'ret': 'ERR', 'msg': 'getNotifications() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    if (status===undefined){
		Notification.find({to_user_id:String(req.session.userId)}, function(err, notList){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    //
		    return res( {'ret':'OK', 'msg':"", 'res':notList} );
		});
	    } else {
		Notification.find({to_user_id:String(req.session.userId),status:status}, function(err, notList){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    //
		    return res( {'ret':'OK', 'msg':"", 'res':notList} );
		});
	    };
	},
	//
	// Kasuje powiadomienie
	//
	updateNotification: function(notif_id) {
	    console.log("delNotification("+notif_id+")...");
	    res( {'ret': 'ERR', 'msg': 'delNotification() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},
	//
	// Dodaje nowe powiadomienie
	//
	putNotification: function( sObj ) {
	    console.log("putNotification()...");
	    if (!sObj || sObj===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru', 'res':[]} );
	    };
	    //
	    if (sObj.to_user_id===undefined && sObj.to_user_email===undefined && sObj.type===undefined && sObj.payload===undefined && sObj.note===undefined && sObj.status===undefined){
		return res( {'ret': 'ERR', 'msg': 'Musisz podać conajmniej jeden wartościowy parametr dla powiadomienia.', 'res':[]} );
	    };
	    //
	    if (!sObj.id){
		sObj.id = null;
	    };
	    //
	    //console.log("notif...");
	    //
	    Notification.findOne({_id:sObj.id}, function(err, notif){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (!notif){
		    var notif = new Notification();
		    notif.from_user = req.session.userId;
		};
		//
		if (sObj.to_user_id!==undefined){
		    notif.to_user_id=sObj.to_user_id;
		};
		if (sObj.to_user_email!==undefined){
		    notif.to_user_email=sObj.to_user_email;
		};
		if (sObj.type!==undefined){
		    notif.type=sObj.type;
		};
		if (sObj.payload!==undefined){
		    notif.payload=sObj.payload;
		};
		if (sObj.note!==undefined){
		    notif.note=sObj.note;
		};
		if (sObj.status!==undefined){
		    notif.status=sObj.status;
		};
		//
		notif.updated_by_user = req.session.userId;
		notif.save(function(err){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    //
		    return res( {'ret':'OK', 'msg':"", 'res':notif} );
		});
		//
	    });
	}
	//
	//
	//
    };
};
//
// EOF
//