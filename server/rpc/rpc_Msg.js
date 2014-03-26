//
// Funkcje obsługi wiadomości
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Msg = require('../schema/Msg')
    , MsgFolder = require("../schema/MsgFolder")
    , moment = require("moment")
    , util = require("util")
//    , async = require("async")
    , ObjectId = require('mongoose').Types.ObjectId
    ;
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Post..." );
    //
    return {
	//
	// Dodanie nowego wpisu lub aktualizacja danych istniejacego
	//
	putMsg: function( sObj ){
	    console.log("putMsg("+util.inspect(sObj)+")...");
	    if (sObj!==undefined) {
		if (sObj.id===undefined){
		    sObj.id = null;
		};
		//console.log("sObj.id="+sObj.id);
		//
		if (sObj.id==null){
		    if (sObj.content===undefined || sObj.recipients===undefined){
			return res( {'ret': 'ERR', 'msg': 'Musisz podać oba wymagane parametry.', 'res':[]} );
		    };
		} else {
		    if (sObj.content===undefined && sObj.recipients===undefined){
			return res( {'ret': 'ERR', 'msg': 'Musisz podać przynajmniej jeden wymagany parametr.', 'res':[]} );
		    };
		};
		//console.log("putMsg.2");
		//
		if (sObj.content.length==0 && sObj.id===null){
		    return res( {'ret': 'ERR', 'msg': 'Wiadomość nie może być pusta.', 'res':[]} );
		};
		//console.log("putMsg.3");
		//
		//console.log("sObj.recipients.length="+sObj.recipients.length);
		if (sObj.recipients.length==0 && !sObj.id){
		    return res( {'ret': 'ERR', 'msg': 'Musisz podać przynajmniej jednego odbiorcę wiadomości.', 'res':[]} );
		};
		//
		Msg.findOne({_id:sObj.id}, function(err, msg){
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    if (!msg){
			var msg = new Msg();
			msg.author = req.session.userId;
		    };
		    if (sObj.content){
			msg.content = sObj.content;
		    };
		    if (sObj.title){
			msg.title = sObj.title;
		    };
		    msg.recipients = sObj.recipients;
		    if (sObj.thread_id){
			msg.thread_id = sObj.thread_id;
		    };
		    msg.save(function(err){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			return res( {'ret':'OK', 'msg':'', 'res':msg} );
		    });
		});
	    } else {
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	},
	//
	// Pobiera liste nieskasowanych wiadomosci uzytkownika (foldery: inbox, outbox),
	// chyba, że podano explicte nazwe typu folderu [inbox, outbox, trash]
	// 
	// Aby pobrac skasowane nalezy podac parametr: folder=trash
	
	getMsgList: function(sObj){
	    console.log("getMsgs():"+util.inspect(sObj));
	    var MaxLimit = 100;	// takie tam sztuczne, wymyslone ograniczenie dla bezpieczenstwa
	    //if (sObj===undefined) return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':[]} );
	    var folderTypes = ["inbox","outbox","trash"];
	    var query = {
		owner:req.session.userId, 
		deleted:false
	    };
	    //
	    if (sObj!==undefined){
		//console.log("getMsgs.1"+sObj.folder);
		if (sObj.folder!==undefined){
		    if (folderTypes.indexOf(sObj.folder)<0){
			return res( {'ret': 'ERR', 'msg': 'Podano błędny typ folderu.', 'res':[]} );
		    } else {
			query.folder = sObj.folder;
			if (sObj.folder==="trash"){
			    query.deleted=true;
			};
		    };
		};
		//
		if (sObj.read!==undefined){
		    if (sObj.read){
			// read=true
			query.status="read";
		    } else {
			// read=false
			query.status = "new";
		    };
		};
		//
		var limit=MaxLimit;	// ustawienie limitu na ograniczenie
		var offset=0;
		if (!sObj.limit || sObj.limit===undefined){
		    var limit=0;
		} else {
		    var limit = sObj.limit;
		    if (limit>MaxLimit){
			limit = MaxLimit;
		    };
		};
		// offset=0 tzn. od poczatku
		if (!sObj.offset || sObj.offset===undefined){
		    var offset=0;
		} else {
		    var offset=sObj.offset;
		};
	    };
	    //
	    //console.log("getMsgs.3.query="+util.inspect(query));
	    MsgFolder
	    .find(query)
	    .populate("msg")
	    .select("-owner -__v")
	    .skip(offset)
	    .limit(limit)
	    .sort("-created_dt")
	    .exec(function(err, msgList){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		//console.log("msgList="+util.inspect(msgList));
		var retList = [];
		if (msgList){
		    msgList.forEach(function(msg){
			//console.log("msg="+util.inspect(msg));
			retList.push({
			    id: msg.msg._id,
			    tid: msg.thread_id,
			    athr: msg.msg.author,
			    rcps: msg.msg.recipients,
			    fld: msg.folder,
			    cnt: msg.msg.content,
			    tle: msg.msg.title,
			    sts: msg.status,
			    cdt: msg.msg.created_dt,
			    del: msg.deleted,
			    del_dt: msg.deleted_dt,
			});
		    });
		};
		//
		return res( {'ret':'OK', 'msg':"", 'res':retList} );
	    });
	},
	//
	// Zmienia status na 'read'
	//
	setMsgRead: function(msg_id){
	    console.log("setMsgRead("+msg_id+")");
	    if (msg_id===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    MsgFolder
	    .findOneAndUpdate({msg:msg_id,owner:req.session.userId},{status:"read",status_change_dt:Date.now()},function(err,upd){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		if (upd){
		    return res( {'ret':'OK', 'msg':"", 'res':true} );
		} else {
		    return res( {'ret': 'ERR', 'msg':"Nie znaleziono wiadomości.", 'res':[]} );
		}
	    });
	},
	//
	// Ustawia flagę skasowania wiadomosci
	//
	delMsg: function(msg_id){
	    console.log("delMsg("+msg_id+")");
	    if (msg_id===undefined){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    MsgFolder
	    .findOneAndUpdate({
		    msg:msg_id,owner:req.session.userId
		},{
		    status:'deleted',deleted:true,deleted_dt:Date.now(),folder:"trash",status_change_dt:Date.now()
		},function(err,upd){
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    if (upd){
			return res( {'ret':'OK', 'msg':"", 'res':true} );
		    } else {
			return res( {'ret': 'ERR', 'msg':"Nie znaleziono wiadomości.", 'res':[]} );
		    }
	    });
	},
		
    };	// do return
};
//

//res( {'ret': 'ERR', 'msg': '() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
// EOF
//