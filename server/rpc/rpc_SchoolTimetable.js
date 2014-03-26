//
// Obsluga dla SchoolTimeTable
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var SchoolTimetable = require('../schema/SchoolTimetable')
    , SchoolTimetableHours = require('../schema/SchoolTimetableHours')
    , util = require("util")
    //, checkAccess_User2Kid = require("../lib/user_funcs").checkAccess_User2Kid()
    , KidsParent = require('../schema/KidsParent')
    , moment = require("moment")
    , ObjectId = require('mongoose').Types.ObjectId
    ;
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_SchoolTimetable..." );
    //
    return {
	//
	// Pobranie godzin planu lekcji wskazanego dziecka
	//
	getSchoolTimetableHours: function( kid_id ) {
	    console.log("getSchoolTimetableHours('"+kid_id+"')...");
		KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
		//checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		    //console.log("getSchoolTimetableHours('"+kid_id+"') -- po spr.");
		    if (err) {
			res( {'ret': 'ERR', 'msg': 'Error: '+err, 'res':[]} );
		    } else {
			//console.log("getSchoolTimetableHours('"+kid_id+"'), dostep="+rtn);
			//console.log("getSchoolTimetableHours::user_kids="+req.session.user_kids);
			//
			// jest dostep do danych dziecka
			if (rtn===true) {
			
			    SchoolTimetableHours.findOne( {kid_id: kid_id}, function(err, tthInfo){
				if (err) {
				    res( {'ret': 'ERR', 'msg': 'Error:'+err, 'res':[]} );
				} else {
				    if (!tthInfo) {
			    		tthInfo = new SchoolTimetableHours();
			    		tthInfo.kid_id = kid_id;
			    		tthInfo.user_id = req.session.userId;
					tthInfo.save(function(err){
					    if (err) {
						res( {'ret': 'ERR', 'msg': 'Error:'+err, 'res':[]} );
					    } else {
						res( {'ret':'OK', 'msg':'', 'res': genSchoolTimetableHours(tthInfo)} );
					    };
					});
				    } else {
					res( {'ret':'OK', 'msg':'', 'res': genSchoolTimetableHours(tthInfo)} );
				    };
				};
			    });
			} else {
			    // brak dostepu do danych dziecka
			    res( {'ret':'ERR', 'msg':'Access denied', 'res': []} );
			}
		    };
		});
	},
	//
	// Zapis informacji o definicji godzin lekcyjnych
	//
	putSchoolTimetableHours: function( sObj  ) {
	    //console.log("putSchoolTimetableHours('"+util.inspect(sObj)+"')...");
	    console.log("putSchoolTimetableHours()...");

	    if (sObj!==undefined && sObj!==null) {
		if (sObj.kid_id!==undefined) {
		    SchoolTimetableHours.findOne( {kid_id: sObj.kid_id, user_id: sObj.user_id}, function(err, newObj){
			if (err) {
			    res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			} else {
			    if (!newObj) {
				var newObj = new SchoolTimetableHours();
			    };
			    // przepisuje definicje godzin
			    newObj.kid_id = sObj.kid_id;
			    newObj.user_id = sObj.user_id;
			    newObj.hour0 = sObj.hour0;
			    newObj.hour1 = sObj.hour1;
			    newObj.hour2 = sObj.hour2;
			    newObj.hour3 = sObj.hour3;
			    newObj.hour4 = sObj.hour4;
			    newObj.hour5 = sObj.hour5;
			    newObj.hour6 = sObj.hour6;
			    newObj.hour7 = sObj.hour7;
			    newObj.hour8 = sObj.hour8;
			    newObj.hour9 = sObj.hour9;
			    newObj.hour10 = sObj.hour10;
			    newObj.hour11 = sObj.hour11;
			    newObj.hour12 = sObj.hour12;
			    newObj.hour13 = sObj.hour13;
			    newObj.hour14 = sObj.hour14;
			    // zapis do DB
			    newObj.save(function(err){
				if (err) {
				    res( {'ret': 'ERR', 'msg':err.err, 'res':[]} );
				} else {
				    res( {'ret':'OK', 'msg':'', 'res': genSchoolTimetableHours( newObj )} );
				};
			    });
			};
		    });
		} else {
		    res( {'ret': 'ERR', 'msg': 'Error: obj.kid_id is required', 'res':[]} );
		};
	    } else {
		res( {'ret': 'ERR', 'msg': 'Error: school time table hours definition is required', 'res':[]} );
	    };

//	    res( true );
	},
	//
	// Zwraca plan zajec dziecka
	//
	getSchoolTimetable: function( kid_id ) {
	    console.log("getSchoolTimetable('"+kid_id+"')...");
		KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
		//checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		    //console.log("getSchoolTimetableHours('"+kid_id+"') -- po spr.");
		    if (err) {
			res( {'ret': 'ERR', 'msg': 'Error: '+err, 'res':[]} );
		    } else {
			//console.log("getSchoolTimetable('"+kid_id+"'), dostep="+rtn);
			//console.log("getSchoolTimetable::user_kids="+req.session.user_kids);
			//
			// jest dostep do danych dziecka
			if (rtn===true) {
			/*
			!!! cos nie dziala POPULATE z tak iloscoa parametrow !!!
			
			    SchoolTimetable
			    .findOne( {kid_id: kid_id} )
			    .populate('day1.hour0','day1.hour1','day1.hour2','day1.hour3','day1.hour4','day1.hour5','day1.hour6','day1.hour7','day1.hour8','day1.hour9','day1.hour10','day1.hour11','day1.hour12','day1.hour13','day1.hour14',
					'day2.hour0','day2.hour1','day2.hour2','day2.hour3','day2.hour4','day2.hour5','day2.hour6','day2.hour7','day2.hour8','day2.hour9','day2.hour10','day2.hour11','day2.hour12','day2.hour13','day2.hour14',
					'day3.hour0','day3.hour1','day3.hour2','day3.hour3','day3.hour4','day3.hour5','day3.hour6','day3.hour7','day3.hour8','day3.hour9','day3.hour10','day3.hour11','day3.hour12','day3.hour13','day3.hour14',
					'day4.hour0','day4.hour1','day4.hour2','day4.hour3','day4.hour4','day4.hour5','day4.hour6','day4.hour7','day4.hour8','day4.hour9','day4.hour10','day4.hour11','day4.hour12','day4.hour13','day4.hour14',
					'day5.hour0','day5.hour1','day5.hour2','day5.hour3','day5.hour4','day5.hour5','day5.hour6','day5.hour7','day5.hour8','day5.hour9','day5.hour10','day5.hour11','day5.hour12','day5.hour13','day5.hour14',
					'day6.hour0','day6.hour1','day6.hour2','day6.hour3','day6.hour4','day6.hour5','day6.hour6','day6.hour7','day6.hour8','day6.hour9','day6.hour10','day6.hour11','day6.hour12','day6.hour13','day6.hour14',
					'day7.hour0','day7.hour1','day7.hour2','day7.hour3','day7.hour4','day7.hour5','day7.hour6','day7.hour7','day7.hour8','day7.hour9','day7.hour10','day7.hour11','day7.hour12','day7.hour13','day7.hour14'
			    ) 
			    .exec(function (err, ttInfo) {
			    */
			    //SchoolTimetable.findOne( {kid_id: kid_id, user_id: req.session.userId}, function(err, ttInfo){
			    SchoolTimetable.findOne( {kid_id: kid_id}, function(err, ttInfo){
				if (err) {
				    res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				} else {
				    if (!ttInfo) {
			    		ttInfo = new SchoolTimetable();
			    		ttInfo.kid_id = kid_id;
			    		ttInfo.user_id = req.session.userId;
					ttInfo.save(function(err){
					    if (err) {
						res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					    } else {
						res( {'ret':'OK', 'msg':'', 'res': genSchoolTimeTable(ttInfo)} );
					    };
					});
				    } else {
					res( {'ret':'OK', 'msg':'', 'res': genSchoolTimeTable(ttInfo)} );
				    };
				};
			    });
			} else {
			    // brak dostepu do danych dziecka
			    res( {'ret':'ERR', 'msg':'Access denied', 'res': []} );
			}
		    };
		});
	},
	//
	// Zapis informacji o definicji godzin lekcyjnych
	//
	putSchoolTimetable: function( sObj  ) {
	    //console.log("putSchoolTimetable:;argObj="+argObj);
	    //var sObj = JSON.parse(argObj);
	    //console.log("putSchoolTimetable['"+util.inspect(sObj)+"']...");
	    //console.log("putSchoolTimetable('"+util.inspect(req.session)+"')...");
	    //console.log("putSchoolTimetable= "+sObj.user_id+"=?="+req.session.userId);
	    if ( String(req.session.userId) === String(sObj.user_id)) {
		KidsParent.isUsersKid(req.session.userId, sObj.kid_id, function(err, rtn){
		//checkAccess_User2Kid(req, res, sObj.kid_id, function(err, rtn){
		    //console.log("getSchoolTimetableHours('"+kid_id+"') -- po spr.");
		    if (err) {
			res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    } else {
			//console.log("getSchoolTimetable('"+kid_id+"'), dostep="+rtn);
			//console.log("getSchoolTimetable::user_kids="+req.session.user_kids);
			//
			// jest dostep do danych dziecka
			if (rtn===true) {
			    // spr. czy juz jest plan lekcji dla tego dzieckai rodzica
			    //SchoolTimetable.findOne( {kid_id: sObj.kid_id, user_id: req.session.userId}, function(err, ttInfo){
			    SchoolTimetable.findOne( {kid_id: sObj.kid_id}, function(err, ttInfo){
				if (err) {
				    res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				} else {
				    if (!ttInfo) {
			    		ttInfo = new SchoolTimetable();
			    		ttInfo.kid_id = sObj.kid_id;
			    		ttInfo.user_id = req.session.userId;
			    	    }
			    	    lDays.forEach(function(day){
				        lHours.forEach(function(hour){
				    	    idx = day + "_" + hour.replace("hour","");
			    		    ttInfo[idx]={ id: null };
				    	    //console.log(">>PUT"+day+" "+hour+", idx="+idx+"; "+util.inspect(sObj[idx])+"; "+ttInfo[idx]+"; ");
				    	    if (sObj[idx]===undefined){
				    		ttInfo[idx] = null;
				    	    } else {
				    		ttInfo[idx] = sObj[idx].id;
				    	    };
					});
				    });
			    	    //console.log(">> 3 PUT SAVE:"+util.inspect( ttInfo));
				    ttInfo.save(function(err){
				        if (err) {
					    res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					} else {
					    res( {'ret':'OK', 'msg':'', 'res': genSchoolTimeTable(ttInfo)} );
					};
				    });
				    /*
				    } else {
					res( {'ret':'OK', 'msg':'', 'res': genSchoolTimeTable(ttInfo)} );
				    };
				    */
				};
			    });
			    
			} else {
			    res( {'ret':'ERR', 'msg':'Access denied (kid)', 'res': []} );
			};
		    };
		});
	    } else {
		res( {'ret':'ERR', 'msg':'Access denied (user)', 'res': []} );
	    };
	},
	//
	// zwraca ilosc pozycji/wpisów jakie sa w planie lekcji
	// ss.rpc("rpc_SchoolTimetable.getSchoolTimetableSummary","50e3e2f67efd0df22d000008");
	//
	getSchoolTimetableSummary: function( kid_id ) {
	    console.log("getSchoolTimetableSummary('"+kid_id+"')...");
	    if (!kid_id || kid_id===undefined){
		res( {'ret':'ERR', 'msg':'Brak wymaganego parametru.', 'res': []} );
	    };
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		//console.log("rtn="+rtn);
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		if (rtn){
		    //SchoolTimetable.findOne( {kid_id: kid_id, user_id: req.session.userId}, function(err, ttInfo){
		    SchoolTimetable.findOne( {kid_id: kid_id}, function(err, ttInfo){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			var retSum = {day1:0,day1:0,day2:0,day3:0,day4:0,day5:0,day6:0,day7:0,sum:0}
			//
			var objid, sbjPresent;
			//
			if (ttInfo){
			    // jest plan lekcji i musze policzyc ilosc zajec
			    //console.log("PLAN LEKCJI:"+util.inspect(ttInfo));
			    lDays.forEach(function(day){
				lHours.forEach(function(hour){
				    idx = day + "_" + hour.replace("hour","");
				    //console.log("idx="+idx+" -> "+ttInfo[idx]);
				    //
				    if (ttInfo[idx]){
					sbjPresent=false;
					try { 
					    objid = new ObjectId(ttInfo[idx]); 
					    sbjPresent = true;
					} catch (e) { 
					    sbjPresent = false;
					};
					if (sbjPresent){
					    retSum[day]+=1;
					    retSum['sum']+=1;
					};
				    };
				    
				}); // do lHours
			    }); // do lDays
			};
			res( {'ret':'OK', 'msg':'', 'res':retSum} );
		    });
		} else {
		    res( {'ret':'ERR', 'msg':'Brak dostępu do danych dziecka.', 'res': []} );
		};
	    });
	}	// do getWchoolTimetableSummary
    };	// do return
}
//
//
//
// Generuje tablice z planem zajec
//
var lDays = ['day1','day2','day3','day4','day5','day6','day7',];
var lHours = ['hour0','hour1','hour2','hour3','hour4','hour5','hour6','hour7','hour8','hour9','hour10','hour11','hour12','hour13','hour14',];
//
function genSchoolTimetableHours( sth ){
    console.log("genSchoolTimetableHours()...");
    var resp = sth;
    //
    lHours.forEach(function(hour){
	if ( resp[hour]=='undefined' ){
	    resp[hour] = {start:'', stop:''};
	};
    });
    //
    //console.log("\ngenSchoolTimetableHours="+util.inspect(resp)+"\n");
    return resp;
};
//
function genSchoolTimeTable( stt ){
    var resp = {};
    var idx = '';
    //
    resp.kid_id = stt.kid_id;
    resp.user_id = stt.user_id;
    resp.valid_from = stt.valid_from;
    resp.valid_to = stt.valid_to;
    //
    lDays.forEach(function(day){
	lHours.forEach(function(hour){
	    idx = day + "_" + hour.replace("hour","");
	    //console.log(">>"+day+" "+hour+", idx="+idx+"; "+stt[day][hour]);
	    //console.log(">>"+day+" "+hour+", idx="+idx+"; "+stt[idx]);
	    //if (stt[day][hour]===undefined) {
	    if (stt[idx]===undefined) {
		//resp[idx] = { id: '', abbr: '', name: ''};
		resp[idx] = { id: '' };
	    } else {
		//resp[idx] = { id: stt[day][hour]._id, abbr: stt[day][hour].abbr, name: stt[day][hour].name, descr: stt[day][hour].description};
		//resp[idx] = { id: stt[day][hour]._id };
		if (!stt[idx]) {
		    resp[idx] = { id: '' };
		} else {
		    resp[idx] = { id: stt[idx] };
		};
	    };
	});
    });
    //
    //
    return resp;
};
//
//res( {'ret': 'ERR', 'msg': 'putSchoolTimetable() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
// EOF
//