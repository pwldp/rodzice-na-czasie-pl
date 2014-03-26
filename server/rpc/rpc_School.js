//
// Obsluga schematu School i nie tylko
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var 
    ServiceUser = require("../schema/ServiceUser")
    , ServiceGroup = require("../schema/ServiceGroup")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , KidInSchoolClass = require("../schema/KidInSchoolClass")
    , TeacherInSchool = require("../schema/TeacherInSchool")
    , ClassTeacher = require("../schema/ClassTeacher")
    //, checkAccess_User2Kid = require("../lib/user_funcs").checkAccess_User2Kid()
    , KidsParent = require('../schema/KidsParent')
    , moment = require("moment")
    , util = require("util")
    , localeComparePL = require("../lib/localeComparePL")
    , async = require("async")
    , validateEmail = require("../lib/validateEmail")
    , slugify = require('slug')
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    //req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_School..." );
    //
    // zapisuje aktywnosc uzytkownika
    //ServiceUser
    /*
    console.log("SESSION="+util.inspect(req.session));
    if (req.session!==undefined){
	if (req.session.lastActivity===undefined){
	    req.session.lastActivity = moment();
	} else {
	    //req.session.lastActivity = moment();
	    var lastActivity = req.session.lastActivity;
	    var currentDt = moment();
	    console.log("DT diff="+currentDt.diff(lastActivity));
	};
	console.log("lastActivity="+req.session.lastActivity);
    };
    */
    //
    return {
	//
	// Pobranie listy szkol wg. podanego typu i miasta
	//
	// ss.rpc("rpc_School.getListSchools","51653b3f58476106c09b26a9","50b7232d7e19759460000003");
	//
	getListSchools: function(city_id, type_id) {
	    console.log("getListSchools("+city_id+","+type_id+")...");
	    if (!city_id || !type_id) return res( {'ret':'ERR', 'msg':'Brak wymaganych parametrów', 'res':[]} );
	    ServiceGroup
	    .where("group_type","school")
	    .where('school_info.school_type_id', type_id)
	    .where('school_info.city_id', city_id)
	    .sort('name')
	    .exec(function(err, itemsList) {
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (itemsList) {
		    var resList = [];
		    itemsList.forEach(function(item) {
			resList.push({
			    'id': item._id, 
			    'name': item.name, 
			    'slug': item.slug,
			    'type': item.school_info.school_type_id,
			    'patron': item.school_info.patron,
			    'city': item.school_info.city,
			    'voivodeship': item.school_info.voivodeship,
			    'zip': item.school_info.postcode,
			    'address': item.school_info.address,
			    'www': item.school_info.www,
			    'email': item.school_info.email,
			    'phone': item.school_info.phone,
			    'note': item.school_info.note
			});
		    });
		    // sortuje liste po nazwie
		    resList.sort(function(a,b) {
			return (a.name.localeComparePL(b.name));
		    });
		    //
		    res( {'ret':'OK', 'msg':'', 'res':resList} );
		} else {
		    res( {'ret':'OK', 'msg':'', 'res':[]} );
		};
	    });
	},
	//
	// Zwraca informacje o szkole
	//
	// ss.rpc("rpc_School.getSchoolInfo","51816f46b5faa60de4becb16");
	//
	getSchoolInfo: function(school_id) {
	    if (!school_id) res( {'ret':'ERR', 'msg':'Brak parametru.', 'res':[]} );
	    console.log("getSchoolInfo...");
	    ServiceGroup.findOne({_id:school_id, group_type:"school"}, function(err, item){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		if (item) {
		    var resRet =
		    {
			'id': item._id, 
			'name': item.name, 
			'slug': item.slug,
			'patron': item.school_info.patron,
			'type': item.school_info.school_type_id,
			'city': item.school_info.city,
			'voivodeship': item.school_info.voivodeship,
			'zip': item.school_info.postcode,
			'address': item.school_info.address,
			'www': item.school_info.www,
			'email': item.school_info.email,
			'phone': item.school_info.phone,
			'note': item.school_info.note
		    };
		    return res( {'ret':'OK', 'msg':'', 'res':resRet} );
		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono danych szkoły', 'res':[]} );
		};
	    });
	},
	//
	// Dodanie klasy do szkoły
	//
	// ss.rpc("rpc_School.putSchoolClass",{school_id:"51816f46b5faa60de4becb16", name:"3a",school_year:"2012"});
	//
	putSchoolClass: function( sObj ) {
	    console.log("putSchoolClass():"+util.inspect(sObj));
	    if (!sObj || sObj===undefined){
		return res( {'ret':'ERR', 'msg': 'Brak parametrów.', 'res':[]} );
	    };
	    //
	    if (!sObj.id){
		sObj.id = null;
	    };
	    // jezeli nie ma sObj.id (czyli update) to musze miec school_id
	    if (sObj.id===null){
		if (!sObj.school_id || sObj.school_id===undefined) {
		    return res( {'ret':'ERR', 'msg': 'Brak ID szkoły.', 'res':[]} );
		};
		if (!sObj.name || sObj.name===undefined){
		    return res( {'ret':'ERR', 'msg': 'Brak nazwy klasy.', 'res':[]} );
		};
		if (!sObj.school_year || sObj.school_year===undefined){
		    return res( {'ret':'ERR', 'msg': 'Brak roku szkolnego.', 'res':[]} );
		};
	    } else {
		// musi byc podany ktorys parametr do aktualizacji
		if (sObj.name===undefined && sObj.school_id===undefined && sObj.school_year===undefined){
		    return res( {'ret':'ERR', 'msg': 'Podaj co najmniej jeden parametr aby zaktualizowac dane.', 'res':[]} );
		};
	    };
	    // przygotowuje queryList
	    var query = {};
	    var queryList = [];
	    query = {_id:sObj.id,group_type:"school_class"};
	    if (sObj.school_id!==undefined){
		query['upper_group_id'] = sObj.school_id;
	    };
	    queryList.push(query);
	    //
	    query = {};
	    if (sObj.id===null && sObj.name!==undefined && sObj.school_id!==undefined && sObj.school_year!==undefined){
		query['group_type'] = "school_class";
		query['name'] = sObj.name;
		query['school_year'] = sObj.school_year;
		query['upper_group_id'] = sObj.school_id
		queryList.push(query);
	    };
	    // szukam klasy
	    console.log("queryList="+util.inspect(queryList));
	    ServiceGroup.findOne({$or:queryList},function(err, schoolClass){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		console.log("schoolClass="+util.inspect(schoolClass));
		if (schoolClass){
		    if (sObj.id==null){
			// prawdopodobnie proba zalozenia takiej samej klasy: nazwa i rocznik
			return res( {'ret':'ERR', 'msg':'Podana klasa już istnieje.', 'res':[]} );
		    } else {
			console.log("Update danych klasy");
			// sObj.id!=null czyli update informacji o klasie
			if (sObj.name!==undefined){
			    schoolClass.name = sObj.name;
			};
			if (sObj.school_year!==undefined){
			    schoolClass.school_year = sObj.school_year;
			};
		    };
		} else {
		    console.log("Nowa klasa");
		    var schoolClass = ServiceGroup();
		    schoolClass.name = sObj.name;
		    schoolClass.school_year = sObj.school_year;
		    schoolClass.group_type = "school_class";
		    schoolClass.upper_group_id = sObj.school_id;
		    schoolClass.edited_dt = Date.now();
		    schoolClass.user_id = req.session.userId;
		};
		// zanim zapisze klase sprawdzam czy istnieje szkola w ktorej ma byc klasa
		ServiceGroup.findOne({_id:schoolClass.upper_group_id}, function(err, school){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    //
		    if (school){
			schoolClass.save(function(err){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    //
			    var ret={};
			    ret['id'] = schoolClass._id;
			    ret['name'] = schoolClass.name;
			    ret['school_year'] = schoolClass.school_year;
			    ret['school_id'] = schoolClass.upper_group_id;
			    return res( {'ret':'OK', 'msg':'', 'res':ret} );
			});
		    } else {
			return res( {'ret':'ERR', 'msg':"Nie znaleziono szkoły.", 'res':[]} );
		    };
		});
	    });
	},
	//
	// Pobranie listy klas w wskazanej szkole
	//
	// ss.rpc("rpc_School.getSchoolClasses","51816f46b5faa60de4becb16");
	//
	getSchoolClasses: function( school_id ) {
	    console.log("getSchoolClasses("+school_id+")...");
	    if (school_id===undefined) return res( {'ret':'ERR', 'msg':"Brak wymaganych parametrów.", 'res':[]} );
	    ServiceGroup
	    .find({upper_group_id:school_id, group_type:"school_class"})
	    //.select("-_id -school_info") - z tym nie dziala - blad MongoDB
	    .select("id name school_year")
	    .sort("name")
	    .exec(function(err, clsList){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		clsList.sort(function(a,b) {
		    return (a.name.localeComparePL(b.name));
		});
		return res( {'ret':'OK', 'msg':'', 'res':clsList} );
	    });
	},
	//
	// Pobranie informacji o klasie
	//
	// OK
	//
	getSchoolClassInfo: function( school_class_id ) {
	    console.log("getSchoolClassInfo...");
	    if (school_class_id===undefined) return res( {'ret':'ERR', 'msg':"Brak parametrów.", 'res':[]} );
	    ServiceGroup
	    //.findById(school_class_id)
	    .findOne({_id:school_class_id})
	    .select("-_id")
	    .select("id name school_year")
	    .exec(function(err, clsInfo){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		var resRet = {};
		if (clsInfo){
		    resRet['id'] = clsInfo.id;
		    resRet['name'] = clsInfo.name;
		    resRet['school_year'] = clsInfo.school_year;
		    resRet['class_teachers'] = [];
		    // czytam kto jest wychowawca klasy
		    ClassTeacher
		    .find({school_class:school_class_id, confirmed:true})
		    .populate("user")
		    .exec(function(err, ctList){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			//console.log("class_teachers="+util.inspect(resRet));
			if (ctList){
			    ctList.forEach(function(item){
				//console.log("dodaje:"+item.user.last_name);
				if (!item.user.deleted){
				    var avatar = "";
				    if (item.user.avatar_id){
					avatar = item.user.avatar_id;
				    };
				    resRet['class_teachers'].push({
					id: item.user.id,
					first_name: item.user.first_name,
					last_name: item.user.last_name,
					avatar: avatar,
				    });
				};
			    });
			};
			//
			return res( {'ret':'OK', 'msg':'', 'res':resRet} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono klasy', 'res':''} );
		};
	    });
	},
	//
	// Dodanie dziecka do klasy prze rodzica
	//
	// OK
	//
	addKidToClassByParent: function(kid_id, school_class_id){
	    console.log("addKidToClassByParent...");
	    if (kid_id===undefined || school_class_id===undefined) {
		return res( {'ret':'ERR', 'msg':"Brak parametrów.", 'res':[]} );
	    };
	    KidInSchoolClass.findOne({kid:kid_id, school_class:school_class_id, deleted:false}, function(err, kidInClass){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (!kidInClass){
		    kidInClass = new KidInSchoolClass();
		    kidInClass.kid = kid_id;
		    kidInClass.school_class = school_class_id;
		    kidInClass.added_by_user = req.session.userId;
		    // jeżeli użytkownik ma dostep do dziecka tzn. jest rodzicem
		    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
		    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			if (rtn) {
			    kidInClass.added_by_user_type = 'parent';
			} else {
			    kidInClass.added_by_user_type = 'nonparent';
			};
			kidInClass.save(function(err){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    if (kidInClass.added_by_user_type==='parent'){
				// czytam ID grupy szkoly
				ServiceGroup.findById(school_class_id, function(err, classGroup){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    if (!classGroup){
					if (err) return res( {'ret':'ERR', 'msg':"Nie znalaziono klasy.", 'res':[]} );
				    } else {
					// zapisuje biezacego uzytkownika do grupy klasy
					ServiceGroupMember.findOne({user_id:req.session.userId,group_id:classGroup.upper_group_id}, function(err, sgms){
					    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
					    //
					    if (!sgms){
						var sgms = new ServiceGroupMember();
						sgms.group_id = classGroup.upper_group_id;	// ID grupy szkoly
						sgms.user_id = req.session.userId;
						sgms.inviting_user = req.session.userId;
						sgms.accepted = true;
					    };
					    sgms.save(function(err){
						if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
						// teraz zapisuje do grupy szkoly
						ServiceGroupMember.findOne({user_id:req.session.userId,group_id:classGroup._id}, function(err, sgmc){
						    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
						    //
						    if (!sgmc){
							var sgmc = new ServiceGroupMember();
							sgmc.group_id = classGroup._id;	// ID grupy szkoly
							sgmc.user_id = req.session.userId;
							sgmc.inviting_user = req.session.userId;
							sgmc.accepted = true;
						    };
						    sgmc.save(function(err){
							if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
							return res( {'ret':'OK', 'msg':'', 'res':true} );
						    });
						})
					    });
					});
				    };
				    
				    return res( {'ret':'OK', 'msg':'', 'res':true} );
				});
			    } else {
				return res( {'ret':'OK', 'msg':'', 'res':true} );
			    };
			});
		    });
		} else {
		    return res( {'ret':'OK', 'msg':'Dziecko jest już dodane do tej klasy.', 'res':true} );
		};
	    });
	},
	//
	// Dodanie dziecka do klasy
	//
	addKidToClassByOther: function(first_name, last_name, parent_email, school_class_id){
	    console.log("addKidToClassByParent...");
	    if (first_name===undefined || last_name===undefined || parent_email===undefined || school_class_id===undefined) {
		return res( {'ret':'ERR', 'msg':"Brak wymaganych parametrów.", 'res':[]} );
	    };
	    var email = parent_email.toLowerCase();
	    if (first_name.length==0 || last_name.length==0 || email.length==0) {
		return res( {'ret':'ERR', 'msg':"Błąd parametrów.", 'res':[]} );
	    };
	    if (!validateEmail(email)){
		return res( {'ret':'ERR', 'msg':"Błędny adres email: '"+email+"'.", 'res':[]} );
	    };
	    // spr. czy podany email jest przypisany do jakiegos usera
	    // .find({$or: [{owner:req.session.userId, private:true}, {_id: {$in: p4gList}}]})
	    ServiceUser
	    .findOne({$or:[{username:email},{email:email}]})
	    .exec(function(err, userInfo){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		console.log("userInfo:"+util.inspect(userInfo));
		if (userInfo) {
		    // znaleziono uzytkownika
		    // szukam grupy klasy
		    ServiceGroup
		    .findOne({_id:school_class_id})
		    .exec(function(err, classInfo){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			// dodaje do grup: klasy i szkoly
			console.log("classInfo:"+util.inspect(classInfo));
			//
			// dodaje tego uzytkownika do grupy klasy
			ServiceGroupMember.findOne({user_id:req.session.userId,group_id:school_class_id}, function(err, sgmInfo){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    //
			    if (!sgmInfo){
				var sgmInfo = new ServiceGroupMember();
				sgmInfo.group_id = school_class_id;
				sgmInfo.user_id = req.session.userId;
				sgmInfo.inviting_user = req.session.userId;
				sgmInfo.accepted = true;
				sgmInfo.save(function(err){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    return res( {'ret':'OK', 'msg':'', 'res':true} );
				});
			    };
			    sgmInfo.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				// dodaje uzytkowniak do grupy szkoly
				ServiceGroupMember.findOne({user_id:req.session.userId,group_id:classInfo.upper_group_id}, function(err, sgInfo){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    //
				    if (!sgInfo){
					var sgInfo = new ServiceGroupMember();
					sgInfo.group_id = classInfo.upper_group_id;
					sgInfo.user_id = req.session.userId;
					sgInfo.inviting_user = req.session.userId;
					sgInfo.accepted = true;
					sgInfo.save(function(err){
					    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
					    // szukam dziecka dla tego usera
					    var slug1 = slugify(first_name.replace(" ","").toLowerCase()+last_name.replace(" ","").toLowerCase());
					    var slug2 = slugify(last_name.replace(" ","").toLowerCase()+first_name.replace(" ","").toLowerCase());
					    Kid.findOne({$or:[{slug:slug1},{slug:slug2}]}, function(err, kidInfo){
						if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
						//
						if (kidInfo){
						    // jezeli jest dziecko to je zapisuje niezatwierdzone do klasy
						    var kisc = new KidInSchoolClass();
						    kisc.kid = kidInfo._id;
						    kisc.school_class = school_class_id;
						    kisc.added_by_user = req.session.userId;
						    kisc.confirmed = false;
						    kisc.save(function(err){
							if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
							return res( {'ret':'OK', 'msg':'', 'res':true} );
						    });
						} else {
						    // nie ma dziecka - dodaje nowe
						    var newKid = new Kid();
						    kid.first_name = first_name;
						    kid.first_name = last_name;
						    kid.parent_id = userInfo._id;
						    kid.save(function(err){
							if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
							//
							var kisc = new KidInSchoolClass();
							kisc.kid = kid._id;
							kisc.school_class = school_class_id;
							kisc.added_by_user = req.session.userId;
							kisc.confirmed = false;
							kisc.save(function(err){
							    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
							    return res( {'ret':'OK', 'msg':'', 'res':true} );
							});
						    });
						};
						
					    });
					});
				    };
				    return res( {'ret':'OK', 'msg':'', 'res':true} );
				});
			    });
			    //
			    return res( {'ret':'OK', 'msg':'', 'res':true} );
			});
		    });
		} else {
		    //
		    // nie ma takiego uzytkownika wiec zakladam nowego i wysylam zaproszenie
		    
		};
		
	    });
	},
	//
	// Skasowanie dziecka do klasy
	//
	// OK
	//
	delKidFromSchoolClass: function(kid_id, school_class_id) {
	    console.log("delKidFromSchoolClass...");
	    if (kid_id===undefined || school_class_id===undefined) {
		return res( {'ret':'ERR', 'msg':"Brak parametrów.", 'res':[]} );
	    };
	    //
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		if (rtn) {
		    KidInSchoolClass
		    .findOneAndUpdate({kid:kid_id, school_class:school_class_id},{deleted:true, deleted_dt:Date.now()},function(err, info){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			return res( {'ret':'OK', 'msg':'', 'res':true} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Usunąć z klasy może tylko rodzic.', 'res':true} );
		};
	    });
	},
	//
	// Potwierdza przez rodzica dziecko w klasie
	//
	// OK
	//
	confirmKidInSchoolClass: function(kid_id, school_class_id){
	    console.log("confirmKidInSchoolClass()...");
	    if (kid_id===undefined || school_id===undefined) {
		return res( {'ret':'ERR', 'msg':"Brak parametrów.", 'res':[]} );
	    };
	    //	    
	    KidsParent.isUsersKid(req.session.userId, kid_id, function(err, rtn){
	    //checkAccess_User2Kid(req, res, kid_id, function(err, rtn){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		if (rtn) {
		    KidInSchoolClass
		    .findOneAndUpdate({kid:kid_id, school_class:school_class_id},{confirmed:true, confirmed_dt:Date.now()},function(err, info){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			return res( {'ret':'OK', 'msg':'', 'res':true} );
		    });
		} else {
		    return res( {'ret':'ERR', 'msg':'Zatwierdzić może tylko rodzic.', 'res':true} );
		};
	    });	    
	},
	//
	// Pobranie listy uczniow wskazanej klasy
	//
	// OK
	//
	getSchoolClassStudents: function(school_class_id) {
	    console.log("getSchoolClassStudents("+school_class_id+")...");
	    if (school_class_id===undefined) return res( {'ret':'ERR', 'msg':"Brak parametrów.", 'res':[]} );
	    //
	    KidInSchoolClass
	    .find({school_class:school_class_id, confirmed:true})
	    .select("-_id -__v -confirmed")
	    //.populate("kid")
	    .populate("kid", "id first_name last_name gender parent_id avatar_id deleted")
	    .populate("added_by_user", "id first_name last_name gender avatar_id")
	    //.sort("kid.last_name")
	    .exec(function(err, kidsList){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		kidsList.sort(function(a, b) {
		    return (a.kid.last_name.localeComparePL(b.kid.last_name));
		});
		return res( {'ret':'OK', 'msg':'', 'res':kidsList} );
	    });
	},
	//
	// Pobranie szkól biezacego uzytkownika
	//
	// OK
	//
	getUserSchools: function() {
	    console.log("getUserSchools...");
	    ServiceGroupMember
	    .find({user_id:req.session.userId, accepted:true})
	    .select("group_id")
	    .populate({path:"group_id", match:{"group_type":"school"}, select:"id name"})
	    .exec(function(err, schoolsList){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		console.log("\n\ngetUserSchools:"+util.inspect(schoolsList));
		//
		var resList=[];
		if (schoolsList){
		    schoolsList.forEach(function(item){
			if (item.group_id){
			    resList.push({school_id:item.group_id.id, name:item.group_id.name});
			};
		    });
		};
		console.log("\n\ngetUserSchools:"+util.inspect(resList));
		return res( {'ret':'OK', 'msg':'', 'res':resList} );
	    });
	},
	//
	// Pobranie klas uzytkownika
	//
	getUserSchoolClasses: function() {
	    console.log("getUserSchoolClasses...");
	    res( {'ret': 'ERR', 'msg': 'getUserSchoolClasses() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},
	//
	// Biezacy uzytkownik dolacza do szkoly jako nauczyciel
	//
	// OK
	//
	joinAsTeacher: function(sObj) {
	    console.log("joinAsTeacher:"+util.inspect(sObj));
	    if (sObj){
		if (sObj.school_id===undefined){
		    return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru (1)', 'res':[]} );
		};
		if (sObj.subjects_id_list===undefined && sObj.subjects_name_list===undefined){
		    return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru (2)', 'res':[]} );
		};
		if (sObj.subjects_id_list.length==0 && sObj.subjects_name_list.length==0){
		    return res( {'ret': 'ERR', 'msg':'Musisz podać przynajmniej jeden przedmiot', 'res':[]} );
		};
		// sa wymagane parametry wiec zapisuje
		// tworze liste przedmiotow do zapisania
		var sbjList=[];
		// ID przedmiotow
		if (sObj.subjects_id_list){
		    sObj.subjects_id_list.forEach(function(item){
			sbjList.push({
			    user_id: req.session.userId,
			    school_id: sObj.school_id,
		
			    sbj_id: item,
			    sbj_name: null
			});
		    });
		};
		// nazwy przedmiotow
		if (sObj.subjects_name_list){
		    sObj.subjects_name_list.forEach(function(item){
			sbjList.push({
			    user_id: req.session.userId,
			    school_id: sObj.school_id,
			    sbj_id: null,
			    sbj_name: item
			});
		    
		    });
		};
		// teraz zapis synchroniczny listy przedmiotow
		async.each(sbjList, saveTeachersSubject, function(err){
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    console.log("joinAsTeacher.2");
		    // zapisuje usera do grupy szkoly
		    ServiceGroupMember
		    .findOne({group_id:sObj.school_id, user_id:req.session.userId}, function(err, sgm){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			if (!sgm){
			    var sgm = new ServiceGroupMember();
			    sgm.group_id = sObj.school_id;	// ID grupy szkoly
			    sgm.user_id = req.session.userId;
			    sgm.inviting_user = req.session.userId;
			    sgm.accepted = true;
			    sgm.save(function(err){
				console.log("joinAsTeacher.3");
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				return res( {'ret':'OK', 'msg':'', 'res':[]} );
			    });
			} else {
			    console.log("joinAsTeacher.4");
			    return res( {'ret':'OK', 'msg':'', 'res':[]} );
			};
		    });
		});
		//
		// !!! Zapis czlonka grupy danej klasy/szkoly !!!
		//
	    } else {
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru (0)', 'res':[]} );
	    };
	},
	//
	// Odlacza biezacego uzytkownika ze wskazanej szkoly jako nayczyciela
	//
	// OK
	//
	disconnFromSchool: function(school_id){
	    console.log("disconnFromSchool("+school_id+")");
	    if (school_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru.', 'res':[]} );
	    };
	    TeacherInSchool.update({school:school_id, user:req.session.userId},{deleted:true, deleted_dt:Date.now()}, {multi:true}, function(err, resp){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		return res( {'ret':'OK', 'msg':'', 'res':[]} );	
	    });
	},
	//
	// Zwraca liste przedmiotow nauczyciela w poszczegolnych szkolach 
	//
	/*
	getTeachersSubjects: function(teacher_id){
	    if (teacher_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru.', 'res':[]} );
	    };
	    console
	    TeacherInSchool
	    //.find({user:teacher_id})
	    .where("user", teacher_id)
	    //.populate("school")	 - nie dziala populate dla szkol ???
	    .populate("subject_id")
	    .exec(function(err, itemsList){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		console.log("getTeachersSubjects="+util.inspect(itemsList));
		
		if (itemsList){
		    if (itemsList.length>0){
			// tworze liste ID szkol
			var schoolsIdList=[];
			itemsList.forEach(function(item){
			    if (item.school){
				//if (schoolsIdList.indexOf(item.school)<0){
				    schoolsIdList.push(item.school);
				//};
			    };
			});
			console.log("schoolsIdList="+util.inspect(schoolsIdList));
			//
			// czytam informacje o szkolach
			School.find({_id: {$in: schoolsIdList}}, function(err, schoolsList){
			    //
			    var resList=[];
			    var schoolPresent=false;
			    if (itemsList){
				itemsList.forEach(function(item){
				    var sbj_id = "";
				    var sbj_name = "";
				    var sbj_descr = "";
				    var sbj_abbr = "";
				    var sbj_cat = "other";
				    if (item.subject_id){
					sbj_id=item.subject_id._id;
					sbj_name = item.subject_id.name;
					sbj_descr = item.subject_id.descr;
					sbj_abbr = item.subject_id.abbr;
					sbj_cat = item.subject_id.cat;
				    } else {
					sbj_name = item.subject_name;
					sbj_abbr = sbj_name;
					sbj_descr = sbj_name;
				    };
				    // szukam czy jest juz szkola
				    schoolPresent = false;
				    for (var i=0; i<=resList.length; i++){
					if (resList[i]!==undefined){
					};
				    };
				    //
				    resList.push({
					id: sbj_id,
					name: sbj_name,
					descr: sbj_descr,
					abbr: sbj_abbr,
					cat: sbj_cat,
				    });
				});
			    };
			    console.log("getTeachersSubjects="+util.inspect(resList));
			    return res( {'ret':'OK', 'msg':'', 'res':resList} );
			});	// do School.find()
		    } else {
			return res( {'ret':'OK', 'msg':'', 'res':[]} );
		    };
		} else {
		    return res( {'ret':'ERR', 'msg':'Wystąpił problem z odczytem przedmiotów nayczyciela.', 'res':[]} );
		};
	    });
	},
	*/
	//
	// Potwierdza nayczyciela w danej szkole
	//
	// OK
	//
	confirmTeacher: function(school_id, teacher_id) {
	    console.log("confirmTeacher("+school_id+","+teacher_id+")...");
	    if (!school_id || !teacher_id){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametru(-ów).', 'res':[]} );
	    };
	    TeacherInSchool.update({school:school_id, user:teacher_id},{confirmed:true, confirmed_dt:Date.now(), confirmed_by_user:req.session.userId}, {multi:true}, function(err, resp){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		if (resp<1){
		    return res( {'ret':'ERR', 'msg':'Nie znaleziono podanego nauczyciela w szkole.', 'res':[]} );
		} else {
		    return res( {'ret':'OK', 'msg':'', 'res':[]} );
		};
	    });
	},
	//
	// Odrzuca nauczyciela w danej szkole
	//
	/*
	denyTeacher: function(school_id, user_id) {
	    console.log("denyTeacher...");
	    res( {'ret': 'ERR', 'msg': 'denyTeacher() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},
	*/
	//
	// Zwraca liste nauczycieli wskazanej szkoly
	//
	// OK
	//
	getSchoolTeachers: function(school_id) {
	    console.log("getSchoolTeachers...");
	    if (school_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru.', 'res':[]} );
	    };
	    TeacherInSchool
	    //.find({school:school_id})
	    .where("school",school_id)
	    .populate("subject_id")
	    //.populate("user","id first_name last_name gender")
	    .populate({ path: 'user', select: 'id first_name last_name gender' })
	    .exec(function(err,tisList){
		console.log(util.inspect(tisList));
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		var resList=[];
		var teacherPresent = false;
		if (tisList){
		    tisList.forEach(function(item){
			//console.log("\nITEm="+item);
			teacherPresent = false;
			for (var i=0; i<=resList.length; i++){
			    if (resList[i]!==undefined && item.user){
				if (resList[i].id===item.user._id){
				    teacherPresent=true;
				    break;
				};
			    };
			};
			//
			//console.log("SUBJECT:"+util.inspect(item.subject_id));
			var sbjId, sbjName, sbjConf;
			if (item.subject_id!==null){
			    sbjId = item.subject_id._id;
			    sbjName = item.subject_id.name;
			} else {
			    sbjId = "";
			    sbjName = item.subject_name;
			};
			if (item.confirmed===undefined){
			    sbjConf=false;
			} else {
			    sbjConf=item.confirmed;
			};
			if (sbjName===null) sbjName="";
			var subject = {id:sbjId, name:sbjName};
			//console.log("SUBJECT:"+util.inspect(subject));
			if (teacherPresent){
			    if (subject.id!=="" || subject.name!==""){
			    //} else {
				resList[i].subjects.push(subject);
			    }
			    resList[i].confirmed=sbjConf;
			} else {
			    if (item.user){
				var newTeacher = {id:item.user._id, gender:item.user.gender, first_name:item.user.first_name, last_name:item.user.last_name, confirmed:sbjConf, subjects:[]};
				if (subject.id!=="" || subject.name!==""){
				//} else {
				    newTeacher.subjects.push(subject);
				};
				resList.push( newTeacher );
			    };
			};

		    });
		    //
		    //console.log("LISTA NAUCZYCIELI:"+util.inspect(resList));
		    if (resList.length>0){
			resList.sort(function(a,b) {
			    return (a.last_name.localeComparePL(b.name));
			});
		    };
		    //
		    return res( {'ret':'OK', 'msg':'', 'res':resList} );
		} else {
		    return res( {'ret':'ERR', 'msg':'Brak nauczycieli w tej szkole.', 'res':[]} );
		};
	    });// do .exec
	},
	//
	// Ustawia wychowace klasy
	//
	// OK
	//
	setClassTeacher: function(teacher_id, school_class_id) {
	    console.log("setClassTeacher...");
	    if (teacher_id===undefined || school_class_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    // szukam ID szkoly
	    //
	    // ??? CZY SPRAWDZAC TUTAJ, ZE USER NALEZY DO GRUPY SZKOLY ???
	    //
	    ServiceGroup
	    .findOne({_id:school_class_id,is_school_class:true})
	    .select("upper_group_id school_id")	// ID szkoly
	    .exec(function(err, sgObj){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (sgObj){
		    // spr. czy podany user jest nauczycielem w odnalezionej szkole
		    TeacherInSchool
		    .findOne({user:teacher_id, school:sgObj.upper_group_id})
		    .select("confirmed")
		    .exec(function(err,tisObj){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			//
			console.log("tisObj="+util.inspect(tisObj));
			var class_confirmed = false;
			if (tisObj){
			    if (tisObj.confirmed){
				// jest zatwierdzonym nauczycielem w szkole
				class_confirmed = true;
			    };
			} else {
			    // nie jest nauczycielem w szkole, wiec moze dodawac potwierdzonych wychowawcow, 
			    // jezeli nie dodaje sam siebie sam 
			    if (String(teacher_id)!==String(req.session.userId)){
				class_confirmed = true;
			    };
			};
			console.log("class_confirmed="+class_confirmed);
			//
			ClassTeacher.findOne({school_class:school_class_id, user:teacher_id}, function(err, ctObj){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    //
			    if (!ctObj){
				// nie ma jeszcze takiego wpisu wiec go stworze
				var ctObj = new ClassTeacher();
				ctObj.school_class = school_class_id;
				ctObj.user = teacher_id;
			    };
			    ctObj.confirmed = class_confirmed;
			    if (ctObj.confirmed){
				ctObj.confirmed_by_user = req.session.userId;
			    };
			    console.log("ctObj="+util.inspect(ctObj));
			    ctObj.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				// dopisuje usera-wychowace do grupy-klasy
				ServiceGroupMember.findOne({group_id:school_class_id,user_id:teacher_id}, function(err, sgmObj){
				    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				    //
				    if (!sgmObj){
					var sgmObj = new ServiceGroupMember();
					sgmObj.group_id = school_class_id;
					sgmObj.user_id = teacher_id;
					sgmObj.confirmed = true;
					sgmObj.accepted = true;
					sgmObj.inviting_user = req.session.userId;
					sgmObj.save(function(err){
					    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
					    return res( {'ret':'OK', 'msg':"", 'res':ctObj} );
					});
				    } else {
					return res( {'ret':'OK', 'msg':"", 'res':ctObj} );
				    };
				});
			    });
			});
		    });	// do TeacherInSchool()
		} else {
		    return res( {'ret':'ERR', 'msg':"Podano błędną klasę", 'res':[]} );
		};
	    });
	},
	//
	// Potwierdza wychowawce klasy, sam siebie nie moze zatwierdzic
	//
	// OK
	//
	confirmClassTeacher: function(teacher_id, school_class_id) {
	    console.log("confirmClassTeacher...");
	    if (teacher_id===undefined || school_class_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    if (teacher_id===req.session.userId){
		return res( {'ret': 'ERR', 'msg':'Nie możesz zatwierdzić sam siebie.', 'res':[]} );
	    };
	    // spr. czy uzytkownik ma dostep do podanej klasy
	    ServiceGroupMember
	    .findOne({group_id:school_class_id, user_id:req.session.userId, accepted:true})
	    .select("group_id")
	    .populate("group_id")
	    .exec(function(err, sgmObj){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (sgmObj){
		    ClassTeacher
		    .findOneAndUpdate({user:teacher_id,school_class:school_class_id},{confirmed:true,confirmed_by_user:req.session.userId},function(err,upd){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			return res( {'ret':'OK', 'msg':"", 'res':[]} );
		    })
		} else {
		    return res( {'ret':'ERR', 'msg':"Brak dostępu do klasy.", 'res':[]} );
		};
	    });
	},
	//
	// Ustawia, ze nie jest wychowawca klasy, moze sam siebie
	//
	// OK
	//
	delClassTeacher: function(teacher_id, school_class_id) {
	    console.log("delClassTeacher...");
	    if (teacher_id===undefined || school_class_id===undefined){
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    };
	    // spr. czy uzytkownik ma dostep do podanej klasy
	    ServiceGroupMember
	    .findOne({group_id:school_class_id, user_id:req.session.userId, accepted:true})
	    .select("group_id")
	    .populate("group_id")
	    .exec(function(err, sgmObj){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (sgmObj){
		    ClassTeacher
		    .findOneAndUpdate({user:teacher_id,school_class:school_class_id},{deleted:true,deleted_by_user:req.session.userId},function(err,upd){
			if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			return res( {'ret':'OK', 'msg':"", 'res':[]} );
		    })
		} else {
		    return res( {'ret':'ERR', 'msg':"Brak dostępu do klasy.", 'res':[]} );
		};
	    });
	},

    };	// do return
}
//
function saveTeachersSubject(args, cb){
    //console.log("saveTeachersSubjects:"+util.inspect(args));
    TeacherInSchool.findOne({user: args['user_id'], school:args['school_id'], subject_id: args['sbj_id'], subject_name: args['sbj_name']}, function(err, tisObj){
	if (err) return cb(err);
	//
	if (!tisObj){
	    console.log("Nie ma tego wpisu");
	    tisObj = new TeacherInSchool();
	    tisObj.user = args['user_id'];
	    tisObj.school = args['school_id'];
	    tisObj.subject_id = args['sbj_id'];
	    tisObj.subject_name = args['sbj_name'];
	    tisObj.save(function(err){
		if (err) return cb(err);	
		return cb(null, true);
	    });
	} else {
	    console.log("Jest ten wpis");
	    tisObj.deleted = false;
	    tisObj.save(function(err){
		if (err) return cb(err);	
		return cb(null, true);
	    });
	};
    });
    //return cb(null, true);
};
//
// EOF
//