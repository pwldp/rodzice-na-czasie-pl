//
// Funkcje dla schematu Post
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
var Post = require('../schema/Post')
    , Comment = require("../schema/Comment")
    , PostForGroup = require("../schema/PostForGroup")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    , moment = require("moment")
    , util = require("util")
    , async = require("async")
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
	putPost: function( sObj ){
	    console.log("putPost("+util.inspect(sObj)+")...");
	    if (sObj!==undefined) {
		if (sObj.id===undefined){
		    sObj.id = null;
		}
		if (!sObj.title || !sObj.content){
		    if (err) return res( {'ret':'ERR', 'msg':'Brak parametru tytułu lub treści', 'res':[]} );
		};
		if (sObj.title.length===0 || sObj.content.length===0){
		    if (err) return res( {'ret':'ERR', 'msg':'Brak tytułu lub treści', 'res':[]} );
		};
		//
		//console.log("POST="+util.inspect(sObj));
		// czytam liste grup biezacego uzytkownika
		//console.log("currentUserId="+req.session.userId);
		ServiceGroupMember
		.where("user_id",req.session.userId)
		.where("accepted",true)
		.select("group_id")
		.exec(function(err, tmpList){
		    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    //console.log("tmpList="+util.inspect(tmpList));
		    var currentUserGroupsID=[];
		    if (tmpList){
			tmpList.forEach(function(item){
			    //console.log("item._id="+item.group_id);
			    currentUserGroupsID.push(String(item.group_id));
			});
		    };
		    //
		    //console.log("currentUserGroupsID="+util.inspect(currentUserGroupsID));
		    //console.log("indexOf="+currentUserGroupsID.indexOf("5127d1062a2b81304b000003"));
		    //
		    Post.findOne({_id: sObj.id}, function(err, fObj){
			//console.log("putPost.1");
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			if (!fObj) {
			    fObj = new Post();
			    fObj.owner = req.session.userId;
			    fObj.comments_num = 0;
			};
			//console.log("putPost.2");
			//
			fObj.title = sObj.title;
			fObj.content = sObj.content;
			fObj.private = sObj.private;
			fObj.public = sObj.public;
			fObj.groups = false;
			//
			// tworze liste grup ze sprawdzeniem czy user jest ich czlonkiem, jezeli takowe sa podane
			var groupsList = []
			var grpsForAsync = [];
			//console.log("putPost-"+sObj.groups);
			if (sObj.groups!==undefined){
			    if (typeof(sObj.groups)==="object" && sObj.groups.length>0){
				var objid;
				sObj.groups.forEach(function(item){
				    try { 
					objid = new ObjectId(item); 
					if (currentUserGroupsID.indexOf(String(objid))>=0){
					    groupsList.push(objid);
					    grpsForAsync.push({post_id:String(fObj._id), group_id:String(objid) });
					} else {
					    console.log("User "+req.session.userId+" nie jest członkiem grupy "+objid+", wiec nie moge nadac dostepu grupie do Posta");
					};
				    } catch (e) { 
					objid = null;
				    };
				});
			    };
			    //console.log("groupsList="+util.inspect(groupsList));
			    // jezeli nie ma jednak grup
			    if (groupsList.length>0){
				fObj.groups = true;
				fObj.groups_list = groupsList;
			    } else {
				fObj.groups = false;
				fObj.groups_list = [];
			    };
			};
			//
			//console.log("putPost.3");
			fObj.save(function(err){
			    //console.log("putPost.4");
			    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    //
			    // jezeli jest operacja update to musze wczensiej skasowac oprzednie przyporzadkowanei post-group
			    PostForGroup.remove({post: fObj._id}, function(err, resp){
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				//
				//console.log("Odp. ze skasowania:"+util.inspect(resp));
				//
				//console.log("A teraz async...");
				async.each(grpsForAsync, assignPostToGroup, function(err){
				    // if any of the saves produced an error, err would equal that error
				    if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    res( {'ret':'OK', 'msg':'', 'res':fObj} );
				});
			    });	// do PostForGroup.remove()
			});
		    });	// do Post.findOne()...
		});	// do ServiceGroupMember...
	    } else {
		res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	},
	//
	// Dodanie nowego wpisu lub aktualizacja danych istniejacego
	//
	delPost: function( post_id ){
	    console.log("delPost()...");
	    if (post_id){
		Post.isAccessibleByUser(post_id, req.session.userId, function(err, isAccessible){
		    Post.findByIdAndRemove(post_id, function(err, fObj){
			if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			if (fObj){
			    Comment.remove({post_id:post_id}, function(err, cObj){
				if (err) return res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				res( {'ret':'OK', 'msg':'', 'res':fObj} );    
			    });
			} else {
			    res( {'ret': 'ERR', 'msg':'Brak wskazanegos posta.', 'res':[]} );
			};
		    });
		
		});
	    } else {
		res( {'ret': 'ERR', 'msg':'Brak wymaganego parametru', 'res':[]} );
	    };
	},
	//
	// Pobranie postów
	//
	getPosts: function( gObj  ){
	    console.log("getPosts("+util.inspect(gObj)+")...");
	    var MaxLimit = 100;	// takie tam sztuczne, wymyslone ograniczenie dla bezpieczenstwa
	    //
	    var providedFilters = ['all','group','private'];
	    //
	    var filter = 'all';
	    var filterIDs = [];
	    var limit=MaxLimit;	// takie tam sztuczne, wymyslone ograniczenie dla bezpieczenstwa
	    var offset=0;
	    //
	    if (gObj){
		if (!gObj.limit || gObj.limit===undefined){
		    var limit=0;
		} else {
		    var limit = gObj.limit;
		    if (limit>MaxLimit){
			limit = MaxLimit;
		    };
		};
		// offset=0 tzn. od poczatku
		if (!gObj.offset || gObj.offset===undefined){
		    var offset=0;
		} else {
		    var offset=gObj.offset;
		};
		// ustawienie filtra
		if (gObj.filter && gObj.filter!==undefined){
		    filter = gObj.filter.toLowerCase();
		    if (providedFilters.indexOf(filter)<0){
			res( {'ret': 'ERR', 'msg':"Błędna wartość filtra.", 'res':[]} )
		    };
		    // sprawdzam czy podano liste grup dla filtra 'group'
		    if (filter==='group'){
			if (!gObj.fil || gObj.fil===undefined){
			    res( {'ret': 'ERR', 'msg':"Brak listy IDs dla filtra grup.", 'res':[]} )
			} else {
			    if (gObj.fil.length>0){
				//filterIDs = gObj.fil; 
				// spr. czy podana lista zawiera ObjectId
				var objid;
				gObj.fil.forEach(function(item){
				    try { 
					objid = new ObjectId(item); 
					filterIDs.push(objid);
				    } catch (e) { 
					res( {'ret': 'ERR', 'msg':"Lista IDs dla filtra grup zawiera błędne ID.", 'res':[]} )
				    };
				});
			    } else {
				res( {'ret': 'ERR', 'msg':"Lista IDs dla filtra grup nie może być pusta.", 'res':[]} )
			    };
			};
		    };
		};
		console.log("getPosts.filter="+filter);
	    };
	    //
	    // czytam dane w zaleznosci od tego jaki jest ustawiony filter
	    if (filter==='all'){
		// czytam grupy usera
		ServiceGroupMember
		.find({user_id:req.session.userId, accepted:true})
		.select("group_id")
		.exec(function(err, tmpList){
		    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    var membershipList=[];
		    if (tmpList){
			tmpList.forEach(function(item){
			    membershipList.push(item.group_id);
			});
		    };
		    //
		    //console.log("membershipList:"+util.inspect(membershipList));
		    // czytam posty nalezace do grup z listy usera
		    PostForGroup.find({group: {$in: membershipList}}, function(err, tmpList){
			if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			var p4gList=[];
			if (tmpList){
			    tmpList.forEach(function(item){
				p4gList.push(item.post);
			    });
			};
			//
			//console.log("p4gList:"+util.inspect(p4gList));
			//
			Post
			.find({$or: [{owner:req.session.userId, private:true}, {_id: {$in: p4gList}}]})
			//.find( {_id: {$in: p4gList}} )
			//.find({owner:req.session.userId, private:true}) - to działa
			.sort('-edited_dt')
			.select("id title content owner edited_dt comments_num last_comment_user_id last_comment_id read_counter")
			.skip(offset)
			.limit(limit)
			.exec(function (err, posts) {
			    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    res( {'ret':'OK', 'msg':'', 'res':posts} );
			});	// do Post...
		    });	// do PostForGroup
		});	// do ServiceGroupMember..
	    } else if (filter==='private'){
		console.log("getPosts - czytam posty prywatne");
		Post
		.find({owner:req.session.userId, private:true})
		.sort('-edited_dt')
		.select("id title content owner edited_dt comments_num last_comment_user_id last_comment_id read_counter")
		.skip(offset)
		.limit(limit)
		.exec(function (err, posts) {
		    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    res( {'ret':'OK', 'msg':'', 'res':posts} );
		});	// do Post...
	    } else if (filter==='group'){
		// czytam posty dla wskazanych grup o ile user jest czlonkiem tych grup
		//
		// a wiec najpierw tworze liste dozwolonych grup
		ServiceGroupMember
		.find({user_id:req.session.userId, accepted:true, group_id: {$in: filterIDs}})
		.select("group_id")
		.exec(function(err, tmpList){
		    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		    //
		    var membershipList=[];
		    if (tmpList){
			tmpList.forEach(function(item){
			    membershipList.push(item.group_id);
			});
		    };
		    //
		    //console.log("membershipList:"+util.inspect(membershipList));
		    // czytam posty nalezace do grup z listy usera
		    PostForGroup.find({group: {$in: membershipList}}, function(err, tmpList){
			if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			//
			var p4gList=[];
			if (tmpList){
			    tmpList.forEach(function(item){
				p4gList.push(item.post);
			    });
			};
			//
			//console.log("p4gList:"+util.inspect(p4gList));
			//
			Post
			.find( {_id: {$in: p4gList}} )
			.sort('-edited_dt')
			.select("id title content owner edited_dt comments_num last_comment_user_id last_comment_id read_counter")
			.skip(offset)
			.limit(limit)
			.exec(function (err, posts) {
			    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    res( {'ret':'OK', 'msg':'', 'res':posts} );
			});	// do Post...
		    });	// do PostForGroup
		});	// do ServiceGroupMember..
	    } else {
		res( {'ret': 'ERR', 'msg':'Nieobsługiwany filtr.', 'res':[]} );
	    };
	    //
	    // Post.isAccessibleByUser()
	    //
	},
	//
	// Dodanie nowego wpisu lub aktualizacja danych istniejacego
	//
	//putComment: function( post_id, comment_id, content){
	putComment: function( sObj ){
	    console.log("putComment()...");
	    if (!sObj.post_id || !sObj.content)
	    {
		res( {'ret': 'ERR', 'msg': 'Parametr(y) nie mają przypisanych wartości.', 'res':[]} );
	    } else {
		var post_id = sObj.post_id;
		var content = sObj.content;
	    };
	    //
	    if (sObj.comment_id){
		var comment_id = sObj.comment_id;
	    };
	    //
	    if (post_id!==undefined && content!==undefined){
		Post.isAccessibleByUser(post_id, req.session.userId, function(err, isAccessible){
		    if (isAccessible) {
			Comment.findOne({_id:comment_id, post_id:post_id, owner_id:req.session.userId}, 
			function(err,fObj){
			    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			    if (!fObj){
				fObj = new Comment();
				fObj.owner_id=req.session.userId;
			    };
			    fObj.post_id = post_id;
			    fObj.content = content;
			    fObj.save(function(err){
				if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				// czytam ilosc komentarzy do Post
				Comment
				.where("post_id", post_id)
				.count(function(err, count){
				    if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
				    // aktualizuje info. o Post
				    Post.findByIdAndUpdate(post_id, {comments_num: count,edited_dt: Date.now(), last_comment_id:fObj._id, last_comment_user_id:req.session.userId}, 
				    function(err, postObj){
					if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
					res( {'ret':'OK', 'msg':'', 'res':fObj} );
				    });	// do Post.update
				});	// do Comment.count...
			    });
			});
		    } else {
			res( {'ret':'ERR', 'msg':'Brak dostępu.', 'res':[]} );
		    };
		});
	    } else {
		res( {'ret': 'ERR', 'msg': 'Brak wymaganych parametrów', 'res':[]} );
	    };
	},
	//
	// Pobranie komentarzy do posta
	//
	//getComments: function(post_id, limit, offset){
	getComments: function(sObj){
	    console.log("getComments()...");
	    if (!sObj.post_id){
		res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru.', 'res':[]} );		
	    } else {
		var post_id = sObj.post_id;
	    };
	    //
	    if (!sObj.limit || sObj.limit===undefined){
		var limit=0;
	    } else {
		var limit = sObj.limit;
	    };
	    //var limit=0;
	    // offset=0 tzn. od poczatku
	    if (!sObj.offset || sObj.offset===undefined){
		var offset=0;
	    } else {
		var offset=sObj.offset;
	    };
	    Post.isAccessibleByUser(post_id, req.session.userId, function(err, isAccessible){
		console.log("isAccessible="+isAccessible);
		if (isAccessible) {
		    Comment
		    .where("post_id", post_id)
		    .sort('edited_dt')
		    .select("id content owner_id edited_dt")
		    .skip(offset)
		    .limit(limit)
		    .exec(function (err, comments) {
			if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
			res( {'ret':'OK', 'msg':'', 'res':comments} );
		    });
		} else {
		    if (err) res( {'ret': 'ERR', 'msg':'Brak dostępu.', 'res':[]} );
		};
	    });
	},
	//
	// Kasuje wskazany komentarz należący do bieżącego usera
	//
	delComment: function( comment_id ){
	    console.log("delComment("+comment_id+")...");
	    if (!comment_id || comment_id===undefined){
		res( {'ret': 'ERR', 'msg': 'Brak wymaganego parametru.', 'res':[]} );
	    };
	    //
	    Comment.findOneAndRemove({_id: comment_id, owner_id:req.session.userId}, function(err, resp){
		if (err) res( {'ret': 'ERR', 'msg':err, 'res':[]} );
		//
		if (resp){
		    res( {'ret':'OK', 'msg':'', 'res':resp} );
		} else {
		    if (err) res( {'ret': 'ERR', 'msg':'Brak dostępu.', 'res':[]} );
		};
	    });
	},
    };	// do return
};
//
function assignPostToGroup(args, cb){
    console.log("assignPostToGroup:;args="+util.inspect(args));
    PostForGroup.findOne({post:ObjectId(args['post_id']), group_id:ObjectId(args['group_id'])}, function(err, p2g){
	if (!p2g){
	    //console.log("Nie ma P2G");
	    var p2g = new PostForGroup();
	    p2g.group = args['group_id'];
	    p2g.post = args['post_id'];
	    p2g.save(function(err){
		if (err) return cb(err);
		return cb(null, true);
	    });
	} else {
	    //console.log("Jest P2G");
	    return cb(null, true);
	};
    });
};
//res( {'ret': 'ERR', 'msg': '() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
//
// EOF
//