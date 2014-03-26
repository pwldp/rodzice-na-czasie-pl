//
// Obsluga CRUD dla Poll - ankiety
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var ObjectId = require('mongoose').Types.ObjectId
    , Poll = require('../schema/Poll')
    , ServiceGroupMember = require('../schema/ServiceGroupMember')
    , moment = require("moment")
    , util = require("util")
    ;
//
exports.actions = function(req, res, ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Poll..." );
    //
    return {
	//
	// tworzy nowa lub aktualizuje istniejaca ankiete
	// ss.rpc("rpc_Poll.putPoll",{question:'czy jest fajnie?',dt_start:"2013-04-01",dt_stop:"2013-11-01",groups:["516b9edc8960172d10000003"],choices:[{choice:"Tak"},{choice:"Nie"}]});
	//
	putPoll: function( sObj ){
	    console.log("putPoll():"+util.inspect(sObj));
	    if (sObj===undefined){
		return res( {'ret':'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    } else {
		if (!sObj.id){
		    sObj.id = null;
		    //console.log("Spr. grupy..."+sObj.groups+", len="+sObj.groups.length);
		    if (sObj.groups===undefined || sObj.groups.length==0){
			return res( {'ret':'ERR', 'msg':'Nie podano grup adresatów ankiety.', 'res':[]} );
		    } else {
			var isErr=false;
			sObj.groups.forEach(function(grp){
			    try {
				var silentVal= ObjectId(grp);
			    } catch (e) {
				isErr=true;
			    }
			});
			if (isErr) return res( {'ret':'ERR', 'msg':'Błąd w liście grup.', 'res':[]} );
		    };
		    if (sObj.choices===undefined || sObj.choices.length<2){
			return res( {'ret':'ERR', 'msg':'Nie podano min. 2 odpowiedzi do ankiety.', 'res':[]} );
		    };
		} else {    
		};
		if (sObj.dt_start!==undefined && !moment(sObj.dt_start).isValid()){
		    return res( {'ret':'ERR', 'msg':'Błędna data początkowa.', 'res':[]} );
		};
		if (sObj.dt_stop!==undefined && !moment(sObj.dt_stop).isValid()){
		    return res( {'ret':'ERR', 'msg':'Błędna data końcowa.', 'res':[]} );
		};
		// spr. czy ma dostep do grup, ktorym udostepnia ankiete
		ServiceGroupMember.find({user_id:req.session.userId, group_id: {$in: sObj.groups}}, function(err, sgmList){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    if (sgmList){
			Poll.findOne({_id: sObj.id,user:req.session.userId}, function(err, newObj){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    //
			    if (!newObj) {
				newObj = new Poll();
			    };
			    if (sObj.question===undefined || sObj.dt_start===undefined || sObj.dt_stop===undefined){
				return res( {'ret':'ERR', 'msg':'Musisz podać przynajmniej jeden wymagany parametr.', 'res':[]} );
			    };
			    newObj.user = req.session.userId;
			    if (sObj.question!==undefined){
				newObj.question = sObj.question;
			    };
			    if (sObj.descr!==undefined){
				newObj.descr = sObj.descr;
			    };
			    if (sObj.dt_start!==undefined){
				newObj.dt_start = sObj.dt_start;
			    };
			    if (sObj.dt_stop!==undefined){
				newObj.dt_stop = sObj.dt_stop;
			    };
			    if (sObj.groups!==undefined){
				newObj.groups = sObj.groups;
			    };
			    if (sObj.choices!==undefined){
				newObj.choices = sObj.choices;
			    };
			    if (sObj.anon!==undefined){
				newObj.anon = sObj.anon;
			    };
			    //
			    newObj.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				//
				return res( {'ret':'OK', 'msg':'', 'res':newObj} );
			    });
			});
		    } else {
			return res( {'ret':'ERR', 'msg':"Brak dostępu do podanych grup.", 'res':[]} );
		    };
		});	// do ServiceGroupMember..
	    };
	},
	//
	// kasuje informacje o istniejacej ankiecie jezeli nikt nie oddal w niej glosu
	// w przeciwnym razie zaznacza ankeite jako skasowana
	//
	delPoll: function(poll_id){
	    console.log("delPoll("+poll_id+")...");
	    if (poll_id===undefined){
		return res( {'ret':'ERR', 'msg':'Brak wymaganego parametru.', 'res':[]} );
	    };
	    Poll.findOne({_id:poll_id}, function(err, poll){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (poll){
		    ServiceGroupMember.find({user_id:req.session.userId, group_id: {$in: poll.groups}}, function(err, sgmList){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			if (sgmList){
			    if (poll.votes.length>0){
				// zaznaczam, ze skasowana
				poll.deleted = true;
				poll.dt_deleted = Date.now();
				poll.save(function(err){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    return res( {'ret':'OK', 'msg':'', 'res':[]} );
				});
			    } else {
				// usuwam ankiete
				poll.remove(function(err){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    return res( {'ret':'OK', 'msg':'', 'res':[]} );
				});
			    };
			} else {
			    return res( {'ret':'ERR', 'msg':"Nie masz dostępu do ankiety.", 'res':[]} );
			};
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':"Nie znaleziono ankiety.", 'res':[]} );
		};
	    });
	},
	//
	// zapisuje wybór uzytkownika w ankiecie
	// ss.rpc("rpc_Poll.putVote","","");
	//
	putVote: function(poll_id, choice_id){
	    console.log("putVote()...");
	    if (poll_id===undefined || choice_id===undefined){
		return res( {'ret':'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    //console.log("putVote.1");
	    Poll.findOne({_id:poll_id}, function(err, pObj){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (pObj){
		    //console.log("putVote.2");
		    // spr. czy mam dostep do tej ankiety
		    var lst = [];
		    pObj.groups.forEach(function(item){
			lst.push(item);
		    });
		    //
		    //console.log("putVote.3"+util.inspect(lst));
		    ServiceGroupMember.find({user_id:req.session.userId, group_id: {$in: lst}}, function(err, sgm){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			//console.log("putVote.3a "+util.inspect(sgm));
			if (sgm){
			    //console.log("putVote.4");
			    // mam dostep do ankiety
			    // spr. czy juz glosowalem
			    var voteFound = false;
			    for (var i=0; i<pObj.votes.length; i++){
				if (String(pObj.votes[i].user)===String(req.session.userId)){
				    //console.log("putVote.4a - znalazlem");
				    // znalazlem moj oddany wczesniej glos
				    pObj.votes[i].choice = choice_id;
				    pObj.votes[i].dt_vote = Date.now();
				    voteFound = true;
				    //console.log("putVote.4b "+util.inspect(pObj.votes[i]));
				    break;
				};
			    };
			    //console.log("putVote.5 "+util.inspect(pObj.votes[i]));
			    // nie znalazlem moje wczesniejszego glosu wiec glosuje teraz
			    if (!voteFound){
				pObj.votes.push({user:req.session.userId, choice:choice_id, dt_vote:Date.now()});
			    };
			    pObj.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				//
				//console.log("putVote.6");
				return res( {'ret':'OK', 'msg':'', 'res':pObj} );
			    });
			} else {
			    return res( {'ret':'ERR', 'msg':'Nie masz dostępu do ankiety', 'res':[]} );
			};
		    });

		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono ankiety.', 'res':[]} );
		};
	    });
	},
	//
	// zwraca liste wszystkich wyborow użytkowników w danej ankiecie
	//
	/*
	getUsersChoices: function(poll_id){
	    console.log("getUsersChoices("+poll_id+")...");
	    return res( {'ret': 'ERR', 'msg': 'getUserChoices() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},
	*/
	//
	// zwraca liste podsumowanie wyborow w danej ankiecie
	//
	getPolls: function( sObj){
	    console.log("getPolls()...:"+util.inspect(sObj));
	    ServiceGroupMember.find({user_id:req.session.userId}, function(err, sgmList){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		//console.log("getPolls.1");
		if (sgmList) {
		    
		    //console.log("getPolls.2.. listaGrup usera:"+util.inspect(sgmList));
		    var lst = [];
		    sgmList.forEach(function(item){
			lst.push(item.group_id);
		    });
		    var query = {groups: {$in: lst}, deleted: false};
		    //console.log("getPolls.3 - query="+util.inspect(query));
		    //console.log("getPolls.3: lst="+util.inspect(lst));
		    if (sObj){
			if (sObj.voted!==undefined){
			    if (sObj.voted){
				query['votes.user'] = req.session.userId;
			    };
			};
			//
			if (sObj.groups!==undefined){
			    if (sObj.groups instanceof Array){
				query['groups'] = {$in: sObj.groups};
			    } else {
				return res( {'ret':'ERR', 'msg':'Grupy należy podać w postaci listy.', 'res':[]} );
			    };
			} else {
			    query['groups'] = {$in: lst};
			};
			//
			if (sObj.date!==undefined){
			    if (moment(sObj.date,"YYYY-MM-DD").isValid() && sObj.date.match(/^(\d{4})\-(\d{2})\-(\d{2})$/)){
				query['dt_start'] = {$lte:sObj.date};
				query['dt_stop'] = {$gte:sObj.date};
			    } else {
				return res( {'ret':'ERR', 'msg':'Datę podaj w formacie: YYYY-MM-DD.', 'res':[]} );
			    };
			};
		    };
		    //console.log("getPolls.3 - query="+util.inspect(query));
		    Poll
		    //.find({groups: {$in: lst}})
		    .find(query)
		    //.select("-_id -__v -votes")
		    //.select("-_id -__v")
		    .exec(function(err, pList){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			var retList = [];
			//console.log("getPolls.3a:"+util.inspect(pList));
			if (pList){
			    //console.log("getPolls.3b");
			    pList.forEach(function(item){
				var pll={};
				//console.log("getPolls.3ba:"+item.id);
				if (item!==undefined){
				    pll['id'] = item['id'];
				    pll['author'] = item['user'];
				    pll['question'] = item['question'];
				    pll['descr'] = item['descr'];
				    pll['dt_start'] = item['dt_start'];
				    pll['dt_stop'] = item['dt_stop'];
				    pll['groups'] = item['groups'];
				    pll['choices'] = item['choices'];
				    pll['vote_counter'] = item['vote_counter'];
				    pll['anon'] = item['anon'];
				    pll['voted'] = {};
				    //console.log("getPolls.3c");
				    // przeszukuje liste oddanych glosow aby sprawdzic czy biezacy user oddal juz glos
				    for (var i=0; i<item['votes'].length; i++){
					if (String(item['votes'][i]['user'])===String(req.session.userId)){
					    pll['voted']['dt_vote']=item['votes'][i]['dt_vote'];
					    pll['voted']['choice']=item['votes'][i]['choice'];
					    break;
					};
				    };
				    //console.log("getPolls.3d");
				    //
				    //console.log("pll="+util.inspect(pll));
				    retList.push(pll);
				};
			    });
			};
			//
			//console.log("getPolls.4: "+util.inspect(retList));
			return res( {'ret':'OK', 'msg':'', 'res':retList} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono grup członkoskich użytkownika.', 'res':[]} );
		};
	    });
	},
    };	// do return
}
//res( {'ret': 'ERR', 'msg': 'putPoll() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
// EOF
//