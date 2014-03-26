//
// Obsluga CRUD dla ServiceGroup
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var ServiceGroup = require('../schema/ServiceGroup')
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , ServiceUser = require("../schema/ServiceUser")
    , moment = require("moment")
    , util = require("util")
    , localeComparePL = require("../lib/localeComparePL")
    ;
//
exports.actions = function(req,res,ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_ServiceGroup..." );
    //
    return {
	//
	// Dodanie nowej grupy lub aktualizacja danych istniejacej
	//
	putGroup: function( sObj ){
	    console.log("putGroup()...");
	    if (sObj!==undefined){
		ServiceGroup.findOne({_id: sObj.id}, function(err, newObj){
		    if (err) {
			return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    } else {
			if (!newObj) {
			    var newObj = ServiceGroup();
			    newObj.user_id = req.session.userId;
			    newObj.owner_id = req.session.userId;
			};
			newObj.name = sObj.name;
			newObj.id = newObj._id;
			//
			// zapamietanie czy to nowa grupa
			var newGroup = newObj.isNew;
			//
			newObj.save(function(err){
			    if (err) {
			    	return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    } else {
				//
				// jezeli nowa grupa to automatycznie dopisuje zalozyciela grupy jako jej członka
				if (newGroup){
				    var sgm = ServiceGroupMember();
				    sgm.group_id = newObj._id;
				    sgm.user_id = req.session.userId;
				    sgm.inviting_user = req.session.userId;
				    sgm.accepted = true;
				    sgm.save(function(err){
					if (err) {
					    return res( {'ret': 'ERR', 'msg': err, 'res':[]} );
					} else {
					    //res( {'ret': 'OK', 'msg':'', 'res': newObj} );
					    getGroupInfo(newObj._id, req.session.userId, function(err, grpInfo){
						if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
						return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
					    });
					};
				    });
				} else {
				    getGroupInfo(newObj._id, req.session.userId, function(err, grpInfo){
					if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
				    });
				};	// do id newGroup
			    };
			});
		    };
		});
	    } else {
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	},
	//
	// Kasuje informacje o grupie
	//
	delGroup: function(group_id){
	    console.log("delGroup("+group_id+")...");
	    //logger.info('rpc_ServiceGroup::delGroup()');
	    //
	    // Skasować może ten, który ją założył
	    //
	    ServiceGroup.findOneAndRemove({_id:group_id, user_id: req.session.userId}, function(err, item){
		if (err) {
		    return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		} else {
		    console.log("item="+item);
		    if (item) {
			ServiceGroupMember.remove({group_id: group_id}, function(err, items){
			    if (err) {
				return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    } else {
				return res( {'ret':'OK', 'msg':'', 'res':{id: group_id}} );
			    };
			});
			
		    } else {
			return res( {'ret':'ERR', 'msg':'Nie znaleziono podanej grupy lub brak uprawnień.', 'res':[]} );
		    };
		};
	    });
	},
	//
	// Zaprasza uzytkownika do podanej grupy
	//
	// !!! Poprawić długie działanie tej funkcji
	//
	inviteToGroup: function(user_id, group_id){
	    console.log("inviteToGroup("+user_id+","+group_id+")...");
	    if (!user_id || !group_id){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	    if (user_id!==undefined && group_id!==undefined){
		// spr. czy biezacy user jest w grupie do ktorej zaprasza
		ServiceGroupMember.findOne({user_id: req.session.userId, group_id: group_id, accepted: true}, function(err, groupMember){
		    if (err) {
			return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    } else {
			if (groupMember) {
			    if ( String(groupMember.user_id) === String(req.session.userId) ){
				var sgm = ServiceGroupMember();
				sgm.group_id = group_id;
				sgm.user_id = user_id;
				sgm.inviting_user = req.session.userId;
				sgm.accepted = false;
				sgm.save(function(err){
				    if (err) {
					return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    } else {
					return res( {'ret': 'OK', 'msg':'', 'res': sgm} );
				    };
				});
			    } else {
				return res( {'ret':'ERR', 'msg': 'Brak dostępu', 'res':[]} );
			    };
			} else {
			    return res( {'ret':'ERR', 'msg': 'Brak dostępu', 'res':[]} );
			};
		    };
		});
	    } else {
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    }
	},
	//
	// Kasuje uzytkownika z grupy.
	//
	// Uzytkownik moze tylko sam siebie skasowac ze wskazanej grupy 'private' lub innego uzytkownika ze swojej grupy 'friends', 
	// wtedy tez jest kasowany z grupy 'friends' uzytkownika, ktorego skasowal ze swoich znajomych.
	//
	delFromGroup: function(user_id, group_id){
	    console.log("delFromGroup("+user_id+","+group_id+")...");
	    if (!user_id || !group_id){
		return res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	    if (user_id!==undefined && group_id!==undefined) {
		//console.log("delFromGroup(1)...");
		ServiceGroupMember
		.findOne({accepted: true, group_id:group_id, user_id:user_id})
		.populate("group_id", "_id group_type owner_id")
		.exec(function(err, grpMem){
		    //console.log("delFromGroup(2)..."+util.inspect(grpMem));
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    if (grpMem){
			//console.log("delFromGroup(3)...type="+grpMem.group_id);
			if (grpMem.group_id.group_type==='friends'){
			    // dla grupy 'friends':
			    //console.log("delFromGroup(4)...grupa FRIENDS");
			    if (String(grpMem.group_id.owner_id)===String(req.session.userId)) {
				//
				// kasuje znajomego dla aktualnego usera
				grpMem.remove(function(err){
				    //console.log("delFromGroup(4a)...");
				    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    ServiceGroup.checkExistsUsersFriendsGroup(String(user_id), function(err, sgObj){
					console.log("delFromGroup(4b)...");
					if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					// kasuje aktualnego usera ze znajomych dla kasowanego usera
					// najpierw szukam grupy 'friends' kasowanego usera
					ServiceGroupMember.findOne({group_id: sgObj._id, user_id:req.session.userId}, function(err, rmObj){
					    //console.log("delFromGroup(4c)..."+util.inspect(rmObj));
					    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					    if (rmObj) {
						//console.log("delFromGroup(4d)...");
						rmObj.remove(function(err){
						    //console.log("delFromGroup(4e)...");
						    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
							     console.log("delFromGroup(4f)...");
						    return res( {'ret':'OK', 'msg':'', 'res':[]} );
						});
					    } else {
						//console.log("delFromGroup(4g)...");
						return res( {'ret':'ERR', 'msg':'Brak członkostwa do skasowania.', 'res':[]} );
					    };
					});	
				    });	// dla grpMem.remove()
				});
			    } else {
				return res( {'ret':'ERR', 'msg':'Brak dostępu. Cudza grupa "Znajomi".', 'res':[]} );
			    };
			} else {
			    //console.log("delFromGroup(5)...");
			    //
			    // jezeli grupa inna niz 'friends' to uzytkownik moze skasowac sie tylko sam z podanej grupy
			    //console.log("delFromGroup:: grupa NIE friends");
			    if (String(req.session.userId)===String(user_id)){
				//console.log("delFromGroup(6)...");
				grpMem.remove(function(err){
				    //console.log("delFromGroup(7)...");
				    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    //
				    // spr. czy są jeszcze jacys członkiwe tej grupy, jezeli nie to kasuje info o grupie
				    //
				    ServiceGroupMember
				    .where("group_id", group_id)
				    .count(function(err, count){
					//console.log("delFromGroup(8)...");
					if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					if (count===0) {
					    //console.log("delFromGroup(9)...");
					    ServiceGroup.findOneAndRemove({_id: group_id}, function(err, rmObj){
						//console.log("delFromGroup(10)...");
						if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
						return res( {'ret':'OK', 'msg':'Skasowałem grupę "'+rmObj.name+'".', 'res':[]} );
					    });
					} else {
					    return res( {'ret':'OK', 'msg':'', 'res':[]} );
					}
				    });
				});
			    } else {
				return res( {'ret':'ERR', 'msg':'Brak dostępu. Kasowanie cudzego członkostwa!', 'res':[]} );
			    };
			};
		    } else {
			return res( {'ret':'ERR', 'msg':'Użytkownik nie jest członkiem grupy.', 'res':[]} );
		    };
		});
		
	    } else {
		return res( {'ret':'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    };
	},
	//
	// Zwraca liste group bieżacego użytkownika
	//
	getListGroups: function(){
	    console.log("getListGroups()...");
	    //logger.info(req.session.id+' - rpc_ServiceUser::getListGroups()');
	    ServiceGroupMember.find({user_id: req.session.userId, accepted: true}, function(err, itemList){
		if (err) {
		    return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		} else {
		    var resList = [];
		    if (itemList) {
			var idsList = [];
			itemList.forEach(function(item){
			    idsList.push(item.group_id);
			});
			ServiceGroup.find({_id: { $in: idsList}}, function(err, listGroups){
			    if (err) {
				return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    } else {
				//console.log("GRUPA:"+util.inspect(listGroups));
				if (listGroups) {
				    listGroups.forEach(function(item){
					if (String(item.group_type)==='friends' && String(item.owner_id)!==String(req.session.userId)){
					    //console.log("Nie moja grupa FRIENDS");
					} else {
					    resList.push({
					        id: item.id
					        , name: item.name
					        , slug: item.slug
					        , group_id: item.group_id
					        , group_type: item.group_type
					        , creation_dt: item.creation_dt
					        //, members: []
					        , active_polls: 0
					        , active_fees: 0
					        , moderator: item.owner_id
						, school_class_id: ''
					    });
					};
				    });
				    // sortuej liste po nazwie
				    resList.sort(function(a, b) {
					return (a.name.localeComparePL(b.name));
				    });
				    return res( {'ret':'OK', 'msg':'', 'res':resList} );
				} else {
				    return res( {'ret':'OK', 'msg':'', 'res':[]} );
				};
			    };
			});
		    } else {
			return res( {'ret':'OK', 'msg':'', 'res':[]} );
		    }
		};
	    });
	},	
	//
	// Zwraca liste czlonkow grupy podanej poprzez ID
	//
	getGroupMembers: function(group_id){
	    console.log("getGroupMembers("+group_id+")...");
	    //logger.info(req.session.id+' - rpc_ServiceGroup::getGroupMembers('+group_id+')');
	    if (group_id===undefined || !group_id) {
		return res( {'ret': 'ERR', 'msg':'Brak wymaganych parametrów.', 'res':[]} );
	    } else {
		getGroupInfo(group_id, req.session.userId, function(err, grpInfo){
		    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
		});
	    };
	},
	//
	// Zwraca info o grupie typu 'friends'
	//
	getGroupFriends: function(){
	    console.log("getGroupFriends()...");
	    //logger.info(req.session.id+' - rpc_ServiceGroup::getGroupFriends('+req.session.userId+')');
	    //
	    // spr. czy user ma juz grupe friends
	    ServiceGroup.checkExistsUsersFriendsGroup(req.session.userId, function(err, groupInfo){
		//
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		if (groupInfo) {
			getGroupInfo(groupInfo._id, req.session.userId, function(err, grpInfo){
			    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
			});
		} else {
			return res( {'ret':'ERR', 'msg':'Brak grupy typu "friends"', 'res':[]} );
		};
	    });

	},
	//
	// Zwraca info o grupie typu 'friends'
	//
	getGroupInvitations: function(){
	    console.log("getGroupInvitations()...");
	    ServiceGroupMember
	    .where('user_id', String(req.session.userId) )
	    .where('accepted', false)
	    .populate("group_id", "_id name group_type")
	    .populate("inviting_user", "_id first_name last_name")
	    .exec(function(err, listGroups){
		//
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		if (listGroups) {
		    console.log("listGroups="+util.inspect(listGroups));
		    // tworze liste
		    tmpList = [];
		    listGroups.forEach(function(item){
			tmpList.push({
			    invit_id: item._id,
			    grp_id: item.group_id._id,
			    grp_name: item.group_id.name,
			    grp_type: item.group_id.group_type,
			    inv_user_id: item.inviting_user._id,
			    inv_user_name: item.inviting_user.last_name + " " + item.inviting_user.first_name,
			    inv_dt: item.creation_dt
			});
		    });
		    return res( {'ret':'OK', 'msg':'', 'res':tmpList} );
		} else {
		    return res( {'ret':'OK', 'msg':'', 'res':[]} );
		};
	    });
	},	// do getGroupInvitations()
	//
	// Potwierdza lub odrzuca przyjecie zaproszenia do grupy
	//
	confirmInvitation: function(invit_id, confirm){
	    //invit_id = "510bb5df2a46655f48000001";
	    console.log("confirmInvitation("+invit_id+","+confirm+")...");
	    if (invit_id!==undefined && confirm!==undefined) {
		//ServiceGroupMember.update({_id: invit_id, accepted: false, user_id: req.session.userId},{'accepted': confirm}, function(err, fObj){
		ServiceGroupMember.findOne({_id: invit_id, accepted: false, user_id: req.session.userId}, function(err, fObj){
		    //
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    if (fObj) {
			console.log("fObj="+util.inspect(fObj));
			if (confirm) {
			    fObj.accepted = confirm;
			    fObj.accepted_dt = Date.now();
			    fObj.save(function(err){
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				// spr. typ grupy. i jednoczesnie jej istnienie
				ServiceGroup.findById( String(fObj.group_id), function(err, grpObj){
				    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    if (grpObj) {
					if (grpObj.group_type === 'friends'){
					    // spr. czy zatwierdzajacy user ma swoja grupe 'friends';
					    // jezeli nie to jest tworzona i zapisuje do niej zapraszajacego usera
					    ServiceGroup.checkExistsUsersFriendsGroup(req.session.userId, function(err, groupInfo){
						if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
						console.log("friendsGroup="+util.inspect(groupInfo));
						if (groupInfo) {
					    	    var memb = new ServiceGroupMember();
					    	    memb.group_id = groupInfo._id;
						    memb.user_id = String(fObj.inviting_user);
						    memb.inviting_user = req.session.userId;
					    	    memb.accepted = true;
						    memb.accepted_dt = Date.now();
						    memb.save(function(err){
							if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
							//res( {'ret':'OK', 'msg':'', 'res':[]} );
							//
							// czytam informacje o grupie
							// jezeli akceptacja do grupy:
							// * 'private' - zwracam info o grupie prywatnej
							// * 'friends' lub innej - zwracam info o grupie 'friends' aktualnego usera
							//
							getGroupInfo(groupInfo._id, req.session.userId, function(err, grpInfo){
							    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
							    return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
							});
					    	    });	// do memb.save()
					        } else {
						    return res( {'ret':'ERR', 'msg':'Błąd obsługi grupy znajomych', 'res':[]} );
						};
					    });
					} else {
					    // inne typy grupy niz 'friends'
					    // zwracam info o grupie
					    getGroupInfo(fObj.group_id, req.session.userId, function(err, grpInfo){
						if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
						return res( {'ret':'OK', 'msg':'', 'res':grpInfo} );
					    });
					    
					    
					};
				    } else {
					return res( {'ret':'ERR', 'msg':'Nie znaleziono grupy, w której użytkownik potwierdza swój udział', 'res':[]} );
				    };
				});	// do ServiceGroup.findById
			    });	// do fObj.save()
			} else {
			    fObj.remove(function(err){
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				return res( {'ret':'OK', 'msg':'', 'res':[]} );
			    });
			};
		    } else {
			return res( {'ret':'ERR', 'msg':'Nie znalazłem zaproszenia', 'res':[]} );
		    };
		});
	    } else {
		return res( {'ret':'ERR', 'msg':'Brak parametrów', 'res':[]} );
	    };
	    
	},	// do confirmInvitation()	
	//
	// Opuszczenie grupy przez biezacego uzytkownika
	//
	leaveGroup: function(group_id){
	    console.log("leaveGroup("+group_id+")...");
	    ServiceGroupMember
	    .findOne({group_id: group_id, user_id: req.session.userId, accepted: true})
	    .populate("group_id", "_id group_type")
	    .exec(function(err, fObj){
		if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		if (fObj){
		    if (fObj.group_id.group_type!=="friends"){
			fObj.remove(function(err){
			    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    return res( {'ret': 'OK', 'msg':"", 'res':[]} );
			});
		    } else {
			return res( {'ret': 'ERR', 'msg':"Nie możesz opuścić tej grupy.", 'res':[]} );
		    };
		} else {
		    return res( {'ret': 'ERR', 'msg':"Nie jesteś członkiem tej grupy.", 'res':[]} );
		};
	    });
	}	// do leaveGroup()
    };	// do return
}
//
// zwraca informacje o podanej 'group_id' grupie
function getGroupInfo(group_id, user_id, cb){
    console.log("getGroupInfo("+group_id+","+user_id+")");
    //
    // spr. czy aktualny user jest czlonkiem wskazanej grupy
    ServiceGroupMember
    .findOne({group_id:String(group_id), user_id: String(user_id)})
    .populate("group_id", "_id name group_type owner_id")
    .exec(function(err, grpInfo){
	//console.log("getGroupInfo::err1="+err);
	if (err) cb(err);
	//
	if (grpInfo) {
	    //
	    var retList = {
		group: {
			id: grpInfo.group_id._id,
			name: grpInfo.group_id.name,
			type: grpInfo.group_id.group_type,
			owner_id: grpInfo.group_id.owner_id,
			},
		members:[]
	    };
	    //console.log("GROUP INFO (1):"+util.inspect(retList));
	    //
	    // czytam liste czlonkow grupy
	    ServiceGroupMember
	    .find({group_id: grpInfo.group_id._id, accepted: true})
	    //.populate("user_id", "_id first_name last_name avatar_id", null, {sort: "last_name"})
	    .populate("user_id", "_id first_name last_name avatar_id")
	    .exec(function(err, itemsList){
		//console.log("getGroupInfo::err2="+err);
		if (err) cb(err);
		//console.log("getGroupInfo::itemsList="+util.inspect(itemsList));
		//
		if (itemsList) {
		    itemsList.forEach(function(item){
			//
			//console.log("getGroupInfo::member="+util.inspect(item));
			//
			if (item.user_id){
			    if ( String(item.user_id._id) === String(user_id) && String(grpInfo.group_id.group_type)==="friends" ) {
				// nie dodaje do listy 'friends' gdy jest aktualny user
			    } else {
				var avatar = "";
				if (item.user_id.avatar_id) {
				    avatar = item.user_id.avatar_id;
				};
				retList['members'].push({
				    id: item.user_id._id,
				    first_name: item.user_id.first_name,
				    last_name: item.user_id.last_name,
				    avatar_id: avatar
				});
			    };
			};
		    });
		    retList['members'].sort(function(a, b) {
			return (a.last_name.localeComparePL(b.last_name));
		    });
		};
		//console.log("GROUP INFO (2):"+util.inspect(retList));
		cb(null, retList);
	    });	// do ServiceGroupMember.find()...- lista userow
	} else {
	    cb("Brak dostępu do grupy");
	}// do if (grpInfo)...
    });	// do ServiceGroupMember. where()... - spr. czy jest czlonwkiem
    
};
//res( {'ret': 'ERR', 'msg': '() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
/*
// sortuje liste
tmpList.sort(function(a, b) {
    return (a.last_name.localeCompare(b.last_name));
});
 */
//
// EOF
//