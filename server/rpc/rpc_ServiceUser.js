//
// Obsluga modelu: ServiceUser
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var ServiceUser = require('../schema/ServiceUser')
    , KidsParent = require("../schema/KidsParent")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , TeacherInSchool = require("../schema/TeacherInSchool")
    , ClassTeacher = require("../schema/ClassTeacher")
    , moment = require("moment")
    , util = require("util")
    , localeComparePL = require("../lib/localeComparePL")
    ;
//
exports.actions = function(req,res,ss) {
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_ServiceUser..." );
    //
    return {
	//
	// Pobranie informacji o uzytkowniku
	//
	getUserInfo: function(user_id) {
	    //var now = moment();
	    //console.log(now.format("YYYY-MM-DD HH:mm:ss")+" "+req.session.userId+" getUserInfo("+user_id+")...");
	    //console.log("SESSION="+util.inspect(req.session));
	    if (user_id===undefined) {
		//console.log("getUserInfo()::ustawiam user_id na Id aktualnego usera="+req.session.userId);
		user_id = req.session.userId
	    }
	    console.log("getUserInfo("+user_id+")...");
	    //console.log("getUserInfo.1");
	    // najpierw czytam dane uzytkownika
	    ServiceUser
	    .findById( user_id)
	    .populate("city_id")
	    .exec(function(err, userInfo){
		if (err) {
		    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		} else {
		    if (userInfo){
			//console.log("getUserInfo.2");
			// czytam dane o jego dzieciach
			//
			//
			KidsParent
			.find({user_id: user_id})
			.select("kid_id")
			.exec(function(err, kidsList){
			    if (err) {
			        return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
			    } else {
				//console.log("getUserInfo.3");
				// przetwarzam liste IDs dzieci
				var wrkKidsList = [];
				if (kidsList) {
				    kidsList.forEach(function(item){
					wrkKidsList.push( item.kid_id );
				    });
				};
				//
				var postcode = "";
				if (userInfo.postcode!==undefined){
				    postcode = userInfo.postcode;
				};
				//
				var city_id = "";
				var city_name = "";
				var voiv_id = "";
				var voiv_name = "";
				//console.log("getUserInfo.3a1");
				if (userInfo.city_id){
				    city_id = userInfo.city_id._id;
				    city_name = userInfo.city_id.name;
				    voiv_id = userInfo.city_id.voiv_id;
				    voiv_name = userInfo.city_id.voiv_name;
				};
				//
				//console.log("getUserInfo.3a");
				var ui = {
			    	    id: userInfo._id,
			    	    username: userInfo.username,
			    	    first_name: userInfo.first_name,
			    	    last_name: userInfo.last_name,
			    	    gender: userInfo.gender,
			    	    avatar_id: userInfo.avatar_id,
			    	    born_date: userInfo.born_date,
			    	    phone: userInfo.phone,
			    	    email: userInfo.email,
				    postcode: postcode,
				    city_id: city_id,
				    city_name: city_name,
				    voiv_id: voiv_id,
				    voiv_name: voiv_name,
				    reg_origin: userInfo.reg_origin,
				    deleted: userInfo.deleted,
				    user_kids: wrkKidsList,
				    friends_group: [],
				    private_groups: [],
				    schools: [],
				    school_classes: [],
				    teacher_in: [],
				    class_teacher_in: []
				};
				//console.log("getUserInfo.3b");
				// czytam info o grupach, do ktorych nalezy user
				ServiceGroupMember
				.find({user_id:user_id})
				.populate("group_id")
				.exec(function(err, grpList){
				    if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				    //  console.log("grpList="+util.inspect(grpList));
				    // tworze listy grup
				    //console.log("getUserInfo.4");
				    if (grpList){
					//console.log("getUserInfo.5");
					var addToList;
					grpList.forEach(function(item){
					    addToList = false;
					    //console.log("ITEM="+util.inspect(item));
					    if (item.group_id){
						if (item.group_id.group_type==='friends'){
						    if (String(item.group_id.owner_id)===String(user_id)){
							addToList=true;
						    };
						} else {
						    addToList = true;
						};
					    };
					    //console.log("getUserInfo.6");
					    //
					    if (addToList){
						var grpInfo = {
						    id: item.group_id._id,
						    name: item.group_id.name,
						};
						//
						//console.log("grpInfo="+util.inspect(grpInfo));
						switch (item.group_id.group_type)
						{
						    case "friends":
							ui.friends_group.push(grpInfo);
							break;
						    case "private":
							ui.private_groups.push(grpInfo);
							break;
						    case "school":
							ui.schools.push(grpInfo);
							break;
						    case "school_class":
							grpInfo.school_id = item.group_id.upper_group_id;
							ui.school_classes.push(grpInfo);
							break;
						};
					    };
					    //console.log("getUserInfo.7");
					});
				    };
				    //console.log("getUserInfo.6");
				    // czytam informację gdzie jest nauczycielem
				    TeacherInSchool
				    .find({user:user_id,deleted:false})
				    .select("school")
				    .exec(function(err,tisList){
					if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					//
					if (tisList){
					    tisList.forEach(function(item){
						ui.teacher_in.push(item._id);
					    });
					};
					// czytam gdzie jest wychowawca
					//console.log("getUserInfo.7");
					ClassTeacher
					.find({user:user_id})
					.populate("school_class")
					.exec(function(err,ctList){
					    if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					    //
					    //console.log("ctList="+util.inspect(ctList));
					    if (ctList){
						ctList.forEach(function(item){
						    ui.class_teacher_in.push({
							school_id: item.school_class.upper_group_id,
							class_id: item.school_class._id,
							class_name: item.school_class.name,
						    });
						});
					    };
					    //console.log("getUserInfo.8");
					    return res( {'ret': 'OK', 'msg':'', 'res':ui} );
					});
				    });
				});
			    };
			});
		    } else {
			return res( {'ret': 'ERR', 'msg': 'Nie znaleziono użytkownika o podanym ID', 'res':[]} );
		    }
		}
	    });
	    
	},
	//
	// Aktualizuje dane o uzytkowniku:
	// first_name - imię
	// last_name - nazwisko
	// pswd - hasło
	// gender - płeć
	// phone - numer telefonu
	// born_date - data urodzenia
	// avatar_id - ID avatara
	// city_id - ID miasta
	// address - adres
	// postcode - kod pocztowy
	//
	updateUserInfo: function( sObj ) {
	    console.log("updateUserInfo="+util.inspect(sObj));

	    ServiceUser.findOne({ _id: String(req.session.userId)}, function(err, userInfo){
		if (err) {
		    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		} else {
		    if (!userInfo) {
			return res( {'ret': 'ERR', 'msg':"Nie znaleziono użytkownika.", 'res':[]} );
		    } else {
			//
			var isUpdate = false;
			//
			if (sObj.first_name){
			    userInfo.first_name = sObj.first_name;
			    isUpdate = true;
			};
			//
			if (sObj.last_name){
			    userInfo.last_name = sObj.last_name;
			    isUpdate = true;
			};
			//
			if (sObj.pswd){
			    userInfo.pswd = sObj.pswd;
			    isUpdate = true;
			};
			//
			if (sObj.gender){
			    userInfo.gender = sObj.gender;
			    isUpdate = true;
			};
			//
			if (sObj.phone){
			    userInfo.phone = sObj.phone;
			    isUpdate = true;
			};
			//
			if (sObj.born_date){
			    userInfo.born_date = sObj.born_date;
			    isUpdate = true;
			};
			//
			if (sObj.avatar_id){
			    userInfo.avatar_id = sObj.avatar_id;
			    isUpdate = true;
			};
			//
			if (sObj.city_id){
			    userInfo.city_id = sObj.city_id;
			    isUpdate = true;
			};
			//
			if (sObj.address){
			    userInfo.address = sObj.address;
			    isUpdate = true;
			};
			//
			if (sObj.postcode){
			    userInfo.postcode = sObj.postcode;
			    isUpdate = true;
			};
			//
			if (isUpdate){
			    userInfo.save(function(err){
				if (err) {
				    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
				} else {
				    //return res( {'ret':'OK', 'msg':"", 'res': getFullUserInfo(userInfo._id)} );	// tutaj powinien generowac pelny rekord informacji o uzytkowniku: getFullUserInfo()
				    return res( {'ret':'OK', 'msg':"", 'res':true});
				}
			    });
			} else {
			    return res( {'ret': 'ERR', 'msg':'Brak danych do aktualizacji.', 'res':[]} );
			};
		    };
		    
		    	
		};
	    });
	},
	//
	// Kasuje informacje o uzytkowniku - Ustawia flage active=false
	//
	delUser: function() {
	    console.log("delUser()...");
	    /*
	    ServiceUser
	    .findOneAndUpdate({_id:req.session.userId},
		{
		username: "",
		name: "konto usunięte",
		email: "",
		deleted:true,
		deleted_dt:Date.now(),
		first_name:"konto",
		last_name:"usunięte",
		avatar_id:null,
		born_date:Date.now(),
		phone:"",
		gender:"unknown",
		origin_name: "",
		origin_id:"",
		address:"",
		postcode:""
	    })
	    .exec(function(err,usr){
		if (err) return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		return res( {'ret':'OK', 'msg':"", 'res':true} );
	    });
	    */
	    return res( {'ret':'OK', 'msg':"", 'res':true} );
	},
	//
	// Zwraca liste uzytkownikow serwisu
	//
	getListUsers: function() {
	    console.log(now.format("YYYY-MM-DD HH:mm:ss")+" "+req.session.userId+" getListUsers()...");
	    //ServiceUser.find({}, function(err, itemsList){
	    ServiceUser
	    .where("deleted", false)
	    .select("first_name last_name gender avatar_id city_id")
	    //.sort("last_name")	- nie dziala z UTF8
	    .exec(function(err, itemsList){
		if (err) {
		    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
		} else {
		    //console.log("LISTA="+util.inspect(itemsList));
		    var resList = [];
		    if (itemsList){
			itemsList.forEach(function(item){
			    var avatar='';
			    if (item.avatar_id!==undefined && item.avatar_id!==null)
			    {
				avatar = item.avatar_id;
			    };
			    resList.push({
				id: item._id,
				first_name: item.first_name,
				last_name: item.last_name,
				gender: item.gender,
				avatar_id: avatar
			    });
			});
		    };
		    resList.sort(function(a,b) {
			return (a.last_name.localeComparePL(b.last_name));
		    });
		    return res( {'ret':'OK', 'msg':'', 'res':resList} );
		};
	    });
	},

    };	// do return
}
//
// generuje pelny rekord informacji o uzytkowniku
/*
 Na razie nie jest potrzebne
function getFullUserInfo( user_id ){
    console.log("getFullUserInfo("+user_id+")...");
    ServiceUser
    .findOne({ _id: user_id})
    .select("")
    .exec(function(err, userInfo){
	if (err) return err;
	//
	
    });
}
*/
//
// EOF
//