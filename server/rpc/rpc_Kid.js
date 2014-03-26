//
// Obsluga modelu: Kid
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Kid = require('../schema/Kid')
    , KidsParent = require('../schema/KidsParent')
    , ServiceGroup = require("../schema/ServiceGroup")
    , KidInSchoolClass = require("../schema/KidInSchoolClass")
    //, checkAccess_User2Kid = require("../lib/user_funcs").checkAccess_User2Kid()
    , util = require("util")
    , moment = require("moment")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_Kid..." );
    //
    return {
	//
	// Pobranie informacji o dziecku
	//
	getKid: function(kid_id) {
	    console.log("getKid("+kid_id+")...");
	    //
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	        console.log("getKid('"+kid_id+"') -- po spr.");
	        if (err) {
	    	    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		} else {
		    //console.log("getKid('"+kid_id+"'), dostep="+rtn);
		    //console.log("getKid::user_kids="+req.session.user_kids);
		    //
		    // jest dostep do danych dziecka
		    if (rtn===true) {
			Kid.findOne({_id: kid_id, deleted:false}, function(err, item) {
			    if (err) {
				return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			    } else {
				if (item){
				    var resList = {
					id: item._id, 
					first_name: item.first_name, 
					last_name: item.last_name, 
					avatar_id: item.avatar_id,
					born_date: item.born_date,
					gender: item.gender,
					address: item.address,
					phone: item.phone,
					email: item.email,
					schools:[],
					'school_class_id': -1,
					'school_class_name': '',
					'school_year': '',
					'school_id': -1,
					'school_name': '', 
					stats_timetable: 0,
					stats_kids_in_class: 0,
					stats_comments: 0,
            				note: item.note,
					deleted: item.deleted,
					deleted_dt: item.deleted_dt,
				    };
				    // czytam info o klasie i szkole
				    KidInSchoolClass
				    .find({kid:kid_id})
				    .populate("school_class upper_group_id")
				    .exec(function(err, kcList){
					if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					//
					if (kcList){
					    console.log("KidSchool="+util.inspect(kcList));
					    var schoolList=[];
					    kcList.forEach(function(item){
						schoolList.push(item.school_class.upper_group_id);
						resList['schools'].push({
						    class_id: item.school_class._id,
						    class_name: item.school_class.name,
						    school_year: item.school_class.school_year,
						    school_id: item.school_class.school_id,		// musi byc ID szkoly, a nie ServiceGroup szkoly
						    school_name: "",
						    join_dt:item.creation_dt,
						    deleted: item.deleted,
						    deleted_dt: item.deleted_dt,
						});
						schoolList.push(item.school_class.upper_group_id);
					    });
					    ServiceGroup
					    .find({_id:{$in: schoolList}})
					    .select("name id")
					    .exec(function(err, siList){
						if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
						//
						//console.log("siList="+siList);
						if (siList){
						    siList.forEach(function(item){
							//console.log("siList.item="+item);
							for (var i=0; i<resList['schools'].length; i++){
							    //console.log("szukam dla szkoly:"+resList['schools'][i].id);
							    if (String(resList['schools'][i].school_id)===String(item.id)){
								resList['schools'][i].school_name = item.name;
							    };
							};
						    });
						};
						return res( {'ret': 'OK', 'msg':'', 'res': resList} );
					    });

					} else {
					    return res( {'ret': 'OK', 'msg':'', 'res': resList} );
					}
				    });
				} else {
				    return res( {'ret': 'ERR', 'msg':'Nie znaleziono danych dziecka', 'res':[]} );
				};
			    }
			});		    
		    } else {
		        // brak dostepu do danych dziecka
		        return res( {'ret':'ERR', 'msg':'Access denied', 'res': []} );
		    }
		};
	    });

	},
	//
	// Zapis danych dziecka (nowego i aktualizacja jezeli jest podane id)
	//
	putKid: function( sObj ) {
	    console.log("putKid..."+util.inspect(sObj));
	    if (sObj!==undefined){
	        if (sObj.id===null || sObj.id===undefined){
	    	    // nowe dziecko
	    	    var newObj = Kid();
		    newObj.first_name = sObj.first_name;
		    newObj.last_name = sObj.last_name;
		    newObj.born_date = sObj.born_date;
		    newObj.gender = sObj.gender;
		    newObj.avatar_id = sObj.avatar_id;
		    newObj.address = sObj.address;
		    newObj.zipcode = sObj.zipcode;
		    newObj.city_id = sObj.city_id;
		    newObj.phone = sObj.phone;
		    newObj.email = sObj.email;
		    newObj.note = sObj.note;
		    newObj.parent_id = req.session.userId;
		    //
		    newObj.save(function(err){
			if (err) {
			    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			} else {
			    // zapisuje info o rodzicu
			    KidsParent.findOne({user_id:req.session.userId}, function(err, kipa){
				if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				if (!kipa){
				    var kipa = KidsParent();
				    kipa.user_id = req.session.userId;
				};
				// spr .czy podane ID dziecka jest juz w przypisanie userowi
				var kidExists = false;
				kipa.kids.forEach(function(itemKid){
				    if (String(itemKid.kid_id)===String(newObj._id)){
					kidExists=true;
				    };
				});
				if (kidExists){
				    return res( {'ret': 'ERR', 'msg': "Dziecko jest już przypisane.", 'res':[]} );
				} else {
				    kipa.kids.push({kid_id:newObj._id, confirmed:true})
				};
				// zapisuje info. o przypisaniu dzecika do rodzica
				kipa.save(function(err){
				    if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				    res( {'ret':'OK', 'msg':'', 'res':newObj} );
				});
		    
			    /*
			    newKipa.kid_id = newObj._id;
			    newKipa.user_id = req.session.userId;
			    newKipa.confirmed = true;
			    newKipa.save(function(err){
				if (err) {
				    res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				} else {
				    newObj.id = newObj._id;
				    res( {'ret':'OK', 'msg':'', 'res':newObj} );
				};
			    });
			    */
			    });
			};
		    });
	    	    
	        } else {
	    	    // aktualizacja danych istniejacego dziecka
		    //checkAccess_User2Kid(req, res, sObj.id, function(err, rtn){
		    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
			//console.log("putKid('"+sObj.id+"') -- po spr.");
			if (err) {
			    res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			} else {
			    if (rtn===true) {
				// jest dostep do danych dziecka
				//console.log("putKid('"+sObj.id+"') -- JEST DOSTEP");
				Kid.findOne({_id: sObj.id}, function(err, newObj){
				    if (err) {
					res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				    } else {
					//
				        newObj.first_name = sObj.first_name;
					newObj.last_name = sObj.last_name;
					newObj.born_date = sObj.born_date;
					newObj.gender = sObj.gender;
					newObj.avatar_id = sObj.avatar_id;
					newObj.address = sObj.address;
					newObj.zipcode = sObj.zipcode;
					newObj.city_id = sObj.city_id;
					newObj.phone = sObj.phone;
					newObj.email = sObj.email;
					newObj.note = sObj.note;
					newObj.parent_id = req.session.userId;
					//
					newObj.save(function(err){
					    if (err) {
						res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					    } else {
						newObj.id = newObj._id;
						res( {'ret':'OK', 'msg':'', 'res':newObj} );
					    };
					});
				    }
				});
			    } else {
				// brak dostepu do danych dziecka
				res( {'ret':'ERR', 'msg':'Access denied', 'res': []} );
			    }
			};
		    });
		};	// do else z if (sObj.id===null || sObj.id===undefined){

	    } else {
		res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrow', 'res':[]} );
	    }
	},
	//
	// ustawia avatara dla dziecka
	//
	setKidAvatar: function(kid_id, file_id){
	    console.log("setKidAvatar...");
	    Kid.findOne({_id: kid_id}, function(err, item){
		if (err) {
		    res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		} else {
		    if (item){
			item.avatar_id = file_id;
			item.save(function(err){
			    if (err) {
				res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			    } else {
				res( {'ret':'OK', 'msg':'', 'res':{'kid_id': item._id, 'avatar_id': item.avatar_id}} );
			    };
			});
		    } else {
			res( {'ret': 'ERR', 'msg': 'Kid not found, id='+kid_id, 'res':[]} );
		    };
		};
	    });
	},
	//
	// Zwraca informacje o dzieciach aktualnego uzytkownika, jeżeli user_id = undefined lub podanego przez user_id
	//
	//-------------------------
	getKidsInfo: function(user_id){
	    if (user_id===undefined) {
		user_id = req.session.userId;
	    }
	    console.log("getKidsInfo("+user_id+")...");
	    KidsParent
	    .findOne({user_id: user_id,confirmed:true})
	    .populate("kids.kid_id")
	    .sort("kids.last_name")
	    .exec(function(err, listParentKids){
		if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		//
		//console.log("listParentKids="+util.inspect(listParentKids.kids));
		if (listParentKids){
		    var kidsIdList = [];
		    var resList = [];
		    
		    listParentKids.kids.forEach(function(item){
			resList.push({ 
			    id: item.kid_id._id,
			    first_name: item.kid_id.first_name,
			    last_name: item.kid_id.last_name,
			    avatar_id: item.kid_id.avatar_id,
			    born_date: item.kid_id.born_date,
			    gender: item.kid_id.gender,
			    address: item.kid_id.address,
			    phone: item.kid_id.phone,
			    email: item.kid_id.email,
			    deleted: item.kid_id.deleted,
			    deleted_dt: item.deleted_dt,
			    schools:[],
			    school_class_id: "",
			    school_class_name: "",
			    school_id: "",
			    school_name: "",
			    stats_timetable: 0,
			    stats_kids_in_class: 0,
			    stats_comments: 0,
			    note: item.note
			});
			//console.log("kid_id="+item.kid_id._id);
			kidsIdList.push(item.kid_id._id);
		    });
	    
		    // czytam klasy dzieci
		    //console.log("\nkidsIdList="+util.inspect(kidsIdList)+"\n");
		    if (kidsIdList.length>0){
			KidInSchoolClass
			.find({kid: {$in: kidsIdList}})
			.populate("school_class")
			.exec(function(err, kiscList){
			    if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			    //
			    //console.log("kiscList="+util.inspect(kiscList));
			    if (kiscList.length>0){
				kiscList.forEach(function(item){
				    //console.log("Spr. dla kazdego dziecko ze szkoly:"+item.kid);
				    for (var i=0; i<resList.length; i++){
					//console.log("...szukam ma szkole dziecko="+resList[i].id);
					if (String(item.kid)===String(resList[i].id)){// && kiscList.school_class!==undefined ){
					    //console.log("znalazlem ID="+resList[i].id+"\n"+item.school_class);
					    resList[i].schools.push({
						class_id:item.school_class._id, 
						class_name:item.school_class.name, 
						school_id: item.school_class.upper_group_id,		// musi byc ID szkoly, a nie ServiceGroup szkoly
						school_year:item.school_class.school_year, 
						join_dt:item.creation_dt,
						deleted: item.deleted,
						deleted_dt: item.deleted_dt,
					    });
					    break;
					};
				    };
				});
				//
				res( {'ret':'OK', 'msg':'', 'res':resList} );
			    } else {
				res( {'ret':'OK', 'msg':'', 'res':resList} );
			    };
			});
		    } else {
			res( {'ret':'OK', 'msg':'', 'res':resList} );
		    };
		} else {
		    res( {'ret':'OK', 'msg':'', 'res':[]} );
		};
	    });
	},
	//------------------------------------------
	//
	// Kasuje informacje o uzytkowniku - Ustawia flage active=false
	//
	delKidInfo: function( kid_id ) {
	    console.log("delKidInfo('"+kid_id+"')...");
	    if (kid_id===undefined) return res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru', 'res':[]});
	    //
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
		if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		//
		if (rtn){
		    Kid.findOneAndUpdate({_id:kid_id},{deleted:true,deleted_dt:Date.now()}, function(err, upd){
			if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			//
			if (upd){
			    return res( {'ret':'OK', 'msg':'', 'res':true} );
			} else {
			    return res( {'ret':'ERR', 'msg':'Nie znaleziono danych dziecka.', 'res':[]} );
			};
		    });
		} else {
		    return res( {'ret': 'ERR', 'msg':"Brak dostępu do danych dziecka.", 'res':[]} );
		};
	    });
	},
	//
	// Przypisuje dziecko do szkoły/klasy
	//
	assignKid2SchoolClass: function(kid_id, school_class_id){
	    console.log("assignKid2SchoolClass('"+kid_id+","+school_class_id+"')...");
	    res( {'ret': 'ERR', 'msg': 'delKidInfo() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    // szukam klasy po ID
	    ServiceGroup.findOne({_id:school_class_id, is_school_class:true}, function(err, classGroup){
		return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		//
		if (classGroup){
		    
		} else {
		    return res( {'ret': 'ERR', 'msg':"Nie znaleziono podanej klasy.", 'res':[]} );
		};
	    });
	    
	},
	//
	// Dopisuje kolejnego opiekuna do dziecka
	//
	putKidParent: function(kid_id, parent_id, level){
	    console.log("putKidParent("+kid_id+","+parent_id+")");
	    if (kid_id===undefined || parent_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametrów', 'res':[]} );
	    };
	    if (level===undefined){
		var level = "0";
	    };
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		if (rtn){
		    /*
		    KidsParent.findOne({kid_id:kid_id,user_id:parent_id}, function(err, kipInfo){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			if (!kipInfo){
			    kipInfo = new KidsParent();
			    kipInfo.kid_id = kid_id;
			    kipInfo.user_id = parent_id;
			    kipInfo.level = level;
			    kipInfo.confirmed=false;
			    kipInfo.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				return res( {'ret':'OK', 'msg':"", 'res':true} );
			    });
			} else {
			    return res( {'ret':'OK', 'msg':"", 'res':true} );
			};
		    });
		    */
		} else {
		    return res( {'ret': 'ERR', 'msg':'Brak dostępu do danych dziecka.', 'res':[]} );
		};
	    });
	},
	//
	// Zwraca listę "rodzicow" dziecka
	//
	getKidParents: function(kid_id){
	    console.log("getKidParents("+kid_id+")");
	    if (kid_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru', 'res':[]} );
	    };
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		if (rtn){
		    KidsParent
		    .find({kid_id:kid_id, confirmed:true})
		    .populate("user_id")
		    .exec(function(err, kpList){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			var resList=[];
			console.log("kpList="+util.inspect(kpList));
			if (kpList){
			    kpList.forEach(function(item){
				if (item.user_id.deleted===false){
				    var avatar_id = "";
				    if (item.user_id.avatar_id!==undefined){
					avatar_id = item.user_id.avatar_id;
				    };
				    resList.push({
					id: item.user_id._id,
					first_name: item.user_id.first_name,
					last_name: item.user_id.last_name,
					avatar_id: avatar_id,
				    });
				};
			    });
			    return res( {'ret':'OK', 'msg':"", 'res':resList} );
			} else {
			    return res( {'ret':'OK', 'msg':"", 'res':true} );
			};
		    });
		} else {
		    return res( {'ret': 'ERR', 'msg':'Brak dostępu do danych dziecka.', 'res':[]} );
		};
	    });
	},
	//
	// Uzytkownik potwierdza siebie jako rodzica dziecka po wyslanym wzcesniej zaproszeniu
	//
	confirmKidParent: function(kid_id){
	    console.log("confirmParent("+kid_id+")");
	    if (kid_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru', 'res':[]} );
	    };
	    KidsParent.findOne({kid_id:kid_id, user_id:req.session.userId}, function(err, kip){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (kip) {
		    if (kip.confirmed){
			return res( {'ret':'ERR', 'msg':"Informacja została już potwierdzona.", 'res':[]} );
		    } else {
			kip.confirmed=true;
			kip.save(function(err){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    return res( {'ret':'OK', 'msg':"", 'res':[]} );
			});
		    };
		} else {
		    return res( {'ret':'ERR', 'msg':"Nie znaleziono informacji do potwierdzenia.", 'res':[]} );
		};
	    });
	},
	//
	// usuwa przypisanie dziecka do rodzica
	//
	
    };	// do return
}

//res( {'ret': 'ERR', 'msg': 'delKidInfo() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
function getKidFullInfo(kid_id){
    console.log("getKidFullInfo("+kid_id+")");
    Kid.findOne({_id:kid_id}, function(err, kidInfo){
	if (err) return {'err':err, res:""};
	//
	return {'err':"", res:kidInfo};
    });
};
//
// EOF
//