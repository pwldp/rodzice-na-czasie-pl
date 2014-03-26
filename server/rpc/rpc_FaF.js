//
// Obsluga lokalnych polików i folderów
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.05.09
//
//
var util = require("util")
    , ServiceUser = require('../schema/ServiceUser')
    , ServiceGroup = require('../schema/ServiceGroup')
    , FileUserInfo = require('../schema/FileUserInfo')
    , FileFolder = require('../schema/FileFolder')
    //, Kid = require('../schema/Kid')
    , moment = require("moment")
//    , async = require("async")
    , conf = require("../../conf")
    ;
//
exports.actions = function(req, res, ss) {
    //
    req.use('session');
    req.use('user.checkAuthenticated');
    //
    var now = moment();
    console.log(now.format("YYYY-MM-DD HH:mm:ss") + " rpc_FaF..." );
    //
    return {
	//
	// Pobranie informacji o plikach i folderach bieżacego użytkownika
	//
	getUserFileStorageInfo: function() {
	    console.log("getUserFileStorageInfo("+req.session.userId+")...");
	    //res( {'ret': 'ERR', 'msg': 'getUserFileStorageInfo() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    FileFolder.getRootFolder(req.session.userId, function(err, rootFolder){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		console.log("rootFolder="+util.inspect(rootFolder));
		FileUserInfo.findOne({user_id:req.session.userId}, function(err, userInfo){
		    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		    //
		    if (!userInfo){
			//
			// nie ma danych wiec je tworze
			var userInfo = new FileUserInfo();
			userInfo.user_id = req.session.userId;
			userInfo.size_limit = 104857600; // czyli 100MB w bajtach = 1024*1024*100
			userInfo.size_current = 0;
			userInfo.root_folder = rootFolder._id;
			userInfo.save(function(err){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    return res( {'ret':'OK', 'msg':'', 'res':userInfo} );
			});
		    } else {;
			return res( {'ret':'OK', 'msg':'', 'res':userInfo} );
		    };
		});
	    });
	},
	//
	// Utworzenie folderu w podanym folderze
	//
	// Jezeli nie jest podany parent_fld_id wtedy tworzony jest nowy folder w folderze root uzytkownika
	//
	createFolder: function(fld_name, parent_fld_id) {
	    console.log("createFolder()...");
	    //res( {'ret': 'ERR', 'msg': 'createFolder() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	    FileFolder.findOne({$or:[{name:fld_name},{name:fld_name, parent_folder:parent_fld_id}]}, function(err, fldInfo){
		if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
		//
		if (fldInfo){
		    return res( {'ret':'ERR', 'msg':"Folder już istnieje.", 'res':[]} );
		} else {
		    console.log("folder_id="+parent_fld_id);
		    if (parent_fld_id===null || parent_fld_id===undefined){
			// jezeli nie jest podany
			console.log("folder NIE podany, czyli przyjmuje ze do root'a");
			FileFolder.getRootFolder(req.session.userId, function(err, rootFolder){
			    if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
			    //
			    // spr. czy w folderze glownym jest juz folder o podanej nazwie
			    //FileFolder.findOne({}
			    //
			    var ff = new FileFolder();
			    ff.name = fld_name;
			    ff.owner = req.session.userId;
			    ff.folder_type = 'normal';
			    ff.save(function(err){
				if (err) return res( {'ret':'ERR', 'msg':err, 'res':[]} );
				//
				return res( {'ret':'OK', 'msg':'', 'res':{id:ff._id, name:ff.name}} );
			    });
			});
		    } else {
			// jezeli jest podany parent_fld_id to spr. czy user ma do niego dostep i dopiero wtedy zakladam nowy folder
			console.log("folder podany");
		    };
		};
	    });
	},
	//
	// Pobranie zawartości wskazanego folderu, jezeli brak to folder głowny usera
	//
	getFolderContent: function(fld_id) {
	    console.log("getFolderContent()...");
	    res( {'ret': 'ERR', 'msg': 'getFolderContent() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},
	//
	// Ustawienie współdzielenia folderu
	//
	shareFolder: function(sObj) {
	    console.log("shareFolder()...");
	    res( {'ret': 'ERR', 'msg': 'shareFolder() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
	//
	// Pobranie listy folderów, które ktos mi udostępnia
	//
	getSharedWithMe: function() {
	    console.log("getSharedWithMe()...");
	    res( {'ret': 'ERR', 'msg': 'getSharedWithMe() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},		
	//
	// Usunięcie folderu z zawartością
	//
	delFolder: function(fld_id) {
	    console.log("delFolder()...");
	    res( {'ret': 'ERR', 'msg': 'delFolder() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
	//
	// Przeniesienie folderu do innego folderu
	//
	moveFolder: function(src_fld_id, dst_fld_id) {
	    console.log("moveFolder()...");
	    res( {'ret': 'ERR', 'msg': 'moveFolder() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
	//
	// Skopiowanie pliku do wskazanego folderu
	//
	copyFile: function(src_fid, dst_fld_id) {
	    console.log("copyFile()...");
	    res( {'ret': 'ERR', 'msg': 'copyFile() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
	//
	// Przeniesienie pliku do wskazanego folderu
	//
	moveFile: function(src_fid, dst_fld_id) {
	    console.log("moveFile()...");
	    res( {'ret': 'ERR', 'msg': 'moveFile() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
	//
	// usunięcie wskazanego pliku
	//
	delFile: function(fid) {
	    console.log("delFile()...");
	    res( {'ret': 'ERR', 'msg': 'delFile() :: Funkcja jeszcze nie jest obsługiwana', 'res':[]} );
	},	
    };
};
//

//
// EOF
//