//
// Obsluga uploadu plikow
//
// Dariusz Pawlak <pawlakdp@gmail.com>
// 2012.12.06
//
// http://tech.richardrodger.com/2011/03/28/node-js-%E2%80%93-dealing-with-submitted-http-request-data-when-you-have-to-make-a-database-call-first/
// 401 Unauthorized
//
var crypto = require('crypto')
, gm = require('gm')
, fs = require('fs')
, fse = require('fs-extra')
, mv = require('mv')
, path = require('path')
, util = require('util')
, FileUserInfo = require('../schema/FileUserInfo')
, FileMetaInfo = require('../schema/FileMetaInfo')
, conf = require('../../conf')
, StreamBuffer = require('./streambuffer')

;
console.log("filesDir="+conf.filesDir);
//
module.exports = function file_upload(req, res){
    console.log("Wystartowal FILE_UPLOAD...");
    //
    new StreamBuffer(req);
    //
    // czytam
    //
    var fInfo = new FileMetaInfo();
    fInfo.user_id = req.session.userId;
    fInfo.path = '__empty__';
    fInfo.upload_dt = Date.now();
    fInfo.hash = '__empty__';
    fInfo.has_thumbnail = false;
    fInfo.fsize = 0;
    //
    //
    var tmpRet = {
	ret:"OK", 
	msg:"", 
	res:"", 
	success:true, 
	error:"",
	user_id: req.session.userId,
	size_limit: 0,
	size_current: 0
    };
    //
    //
    get_file_info(req, res, fInfo, function(err, fi){
	console.log("get_file_info::fInfo="+fInfo);
	
	if (err){
	    console.err("Blad: get_file_info()");
	} else {
	    handle_file(req, res, fi, function(err, fi){
		if (err) {
		    console.err("handle_file error:"+err);
		} else {
		    save_info(req, res, fi, function(err, fi){
// 			tmpRet['size_limit'] = req.session.size_limit;
// 			tmpRet['size_current'] =req.session.size_current;
			if (err) {
			    console.err("Po blednym odebraniu pliku: Error:"+err);
			    tmpRet['ret'] = "ERR";
			    tmpRet['msg'] = err;
			    tmpRet['success'] = false;
			    tmpRet['error'] = err;
			} else {
			    console.log("Po poprawnym odebraniu pliku.");
			    tmpRet['ret'] = "OK";
			    tmpRet['msg'] = "";
			    tmpRet['success'] = true;
			    tmpRet['error'] = "";
			}
			return res.end( JSON.stringify(tmpRet) );
		    });	// do save_info()
		};
	    });	// do handle_file()
	};
	
    }); // do get_file_info()
    /*
    };
    }); // do getSizesInfo()
    */
//}; - tu byl koniec exportowanej funkcji
//
function genHashPath( hsh ){
//console.log("Gen dir path from has: "+hsh);
    var maxLen = 9;
    var dvd = 0;
    var path = '/';
    for (var i=0; i<hsh.length; i++){
        dvd+=1;
        if (dvd===maxLen){
            dvd=1;
            path+= '/';
        }
        path+= hsh[i];
        //console.log(dvd+", char="+hsh[i]);
    }
    //console.log("path="+path);
    return path;
}
//
// czyta informacje przekazane od klienta o odbieranym pliku 
function get_file_info(req, res, fi, cb){
    console.log("START: get_file_info");
    //console.log("REQUEST:"+util.inspect(req.headers));
    if (req.method==='POST'){
	//console.log("jest POST");
	//console.log("req.FILES="+util.inspect(req.files.files));
	/*
	 Obsluga dla fineupload
	if (req.headers['x-requested-with']==='XMLHttpRequest'){
	    //console.log("jest XMLHttpRequest");
	    //console.log("UserInfo="+req.session.size_limit);
	    fi.name = req.headers['x-file-name'];
	    fi.basename = decodeURIComponent( path.basename(req.headers['x-file-name']) );
	    fi.ext = path.extname(req.headers['x-file-name']);
	    //fi.size = req.headers['x-file-size'];
	    fi.fsize = parseInt(req.headers['content-length'], 10);
	    fi.mimetype = req.headers['x-mime-type'];
	    fi.path = null;
	    //
	    return cb(null, fi);
	    */
	if (req.headers['x-requested-with']==='XMLHttpRequest' && req.files.files[0] ){	// obsluga jquery plugin
	    var ufi = req.files.files[0];
	    console.log("UFI="+util.inspect(ufi));
	    //console.log("req.files="+util.inspect(reqInfo));
	    fi.name = ufi.name;
	    fi.basename = decodeURIComponent( path.basename(ufi.name) );
	    fi.ext =  path.extname(ufi.name);
	    fi.fsize = parseInt(ufi.size, 10);
	    fi.mimetype = ufi.type;
	    fi.path = ufi.path;
	    //
	    return cb(null, fi);
/*
 Obsluga pobierania avatara z FB	    
 
	} else {
	    //console.log("Co jest w POST?");
	    if (req.files.avatar_file){
		console.log("USER_ID="+req.body.user_id);
		var reqInfo = req.files.avatar_file;
		//console.log("req.files="+util.inspect(reqInfo));
		fi.name = reqInfo.name;
		fi.basename = decodeURIComponent( path.basename(reqInfo.name) );
		fi.ext =  path.extname(reqInfo.name);
		fi.fsize = parseInt(reqInfo.size, 10);
		fi.mimetype = reqInfo.type;
		fi.path = reqInfo.path;
		//
		return cb(null, fi);
	    } else {
		//cb('Obsluguje tylko XMLHttpRequest');
		res.writeHead(405, {"Content-Type":"text/plain"});
		res.end('405 Method Not Allowed\n');
	    };
*/
	}; 
    } else {	// do if POST
	//cb('Metoda '+req.method+' jest nieobslugiwana');
	res.writeHead(405, {"Content-Type":"text/plain"});
	res.end('405 Method Not Allowed\n');
    }; // do if POST
}
//
// zapisuje plik w systemie plikow i tworzy miniaturke
function handle_file(req, res, fi, cb) {
    console.log("START: handle_file"+__dirname);
    //console.log("handle_file::fInfo="+fi);
    var tmpName = ''
    var hsum = crypto.createHash('md5');
    if (fi.path!==null){
	console.log("\nMam plik z POSTa");
	var file = './kitten.jpg';
	var s = fs.ReadStream( fi.path );
	s.on('data', function(d) { hsum.update(d); });
	s.on('end', function() {
	    fi.hash = hsum.digest('hex');
	    tmpName = fi.path;
	    fi.path = genHashPath( fi.hash );
	    put_file_to_storage(fi, tmpName, function(err, fi){
		if (err)
		    return cb(err);
		else
		    return cb(null, fi);
	    });
	});
    } else {
	//

	tmpName = path.resolve(conf.filesDir, req.session.userId+'_'+fi.name);
	//
	//var sb = new StreamBuffer(req);
	req.streambuffer.ondata(function(chunk) {
	// your funky stuff with data
	    //console.log("...req.streambuffer.ondata...");
	});
	//
	req.streambuffer.onend(function(err) {
	    console.log("\nreq.streambuffer.onend\n");
		FileUserInfo.getSizesInfo(req.session.userId, function(err, userInfo){
		    if (err) {
			console.log('err='+err);
			return cb(err);
		    } else {
			console.log("upload:: userInfo: "+userInfo);
			//
			req.session.size_limit = userInfo.size_limit;
			req.session.size_current = userInfo.size_current;
			tmpRet['size_limit'] = userInfo.size_limit;
			tmpRet['size_current'] = userInfo.size_current;
			//
			var size_free = userInfo.size_limit-userInfo.size_current;
			//console.log("upload:: free =?= file ::"+size_free+" =?= "+fi.fsize);
			if (size_free <= fi.fsize){
			    console.log("--- BRAK MIEJSCA ---");
			    tmpRet['msg'] = 'Przekroczony limit miejsca';
			    tmpRet['success'] = false;
			    tmpRet['error'] = tmpRet['msg'];
			    return res.end( JSON.stringify(tmpRet) )
			} else {
			    //console.log("JEST miejsce na plik");
			    cb(null, fi);
			}
		    }
		});
	});
	//
	var ws = fs.createWriteStream( tmpName );
	//
	req.on('data', function(data) { 
	    //console.log("data...");
	    hsum.update(data);
	    ws.write(data);
	});
	//
	req.on('end', function(err) {
	    console.log("req.END");
	    fi.hash = hsum.digest('hex');
	    fi.path = genHashPath( fi.hash );
	    ws.end();
	});
	//    
	ws.on('close', function(data) {
	    console.log("__ CLOSE STREAM __");
	    put_file_to_storage(fi, tmpName, function(err, fi){
		if (err)
		    return cb(err);
		else
		    return cb(null, fi);
	    });
	});
    }; // do if fi.path
};
//
// zapisuje w DB informacje o pliku, aktualizuje info o zajetosci
function save_info(req, res, fi, cb){
    //console.log("START: save_info");
    //
    // spr. czy plik o podanej nazwie jest juz w zasobach uzytkownika
    FileMetaInfo.findOne({name: fi.name}, function(err, foundFile){
	//console.log("\nfoundFile="+foundFile);
	if (foundFile) {

	    tmpRet['msg'] = 'Plik o podanej nazwie:'+fi.name+',  już istnieje';
	    tmpRet['success'] = false;
	    tmpRet['error'] = tmpRet['msg'];
	    return res.end( JSON.stringify(tmpRet) )
	} else {
	    //console.log("MetaInfo="+fi);
	    fi.save(function(err){
		if (err) {
		    //console.log("BLAD ZAPISU DO DB");
		    return cb("Error: "+err);
		} else {
		    //
		    // aktualizuje info o zajetosci dysku przez uzytkownika
		    FileUserInfo.updateSizesInfo(req.session.userId, function(err, uInfo){
			if (err) {
			    return cb(err);
			} else {
			    tmpRet['size_limit'] = uInfo.size_limit;
			    tmpRet['size_current'] = uInfo.size_current;
			    //console.log("Dane po uploadzie:"+uInfo);
			    return cb(null, fi);
			}
		    });
		}
	    }); // do save()
	};
    }); // do findOne()
}
//
function put_file_to_storage(fi, fName, cb){
    var dstDir = path.join(conf.filesDir, fi.path);
    console.log("katalog docelowy:"+dstDir);
    fse.mkdirs(dstDir, function(err){
	if (err) {
	    cb('Nie moge zalozyc katalogu dla pliku');
	} else {
	    var newFName = dstDir+'/file';
	    console.log("Przenosze plik do: "+newFName);
	    mv(fName, newFName, function(err){
		if (err) {
		    cb('Nie mogę przenieść pliku do docelowego katalogu');
		} else {
		    console.log("tworze miniaturke");
		    gm( newFName ).identify(function(err, features){
			console.log("PF.1");
			if (err) {
			    console.log("PF.2");
			    console.log("TO NIE JEST OBRAZEK: "+err);
			    return cb(null, fi);
			} else {
			    console.log("PF.3");
			    // 
			    //rezygnuje z tworzenia minaturek z PDFów gdyż czasem wywala się
			    if (features.format!=="PDF"){
				var thumbName = path.join(dstDir, 'thumb.jpg');
				console.log("generuje thumb do: "+thumbName);
				gm(newFName).thumb(conf.thumb.width, conf.thumb.height, thumbName, 100, function(err){
				    if (err) {
					cb('Błąd generowania miniaturki: '+err);
				    } else {
					fi.has_thumbnail = true;
					return cb(null, fi);
				    }
				});
			    } else {
				return cb(null, fi);
			    };
			};
		    });
		    
		};
	    });	// do mv
	}
    });	// do fse.mkdirs
};
//
};	// koniec do exportowanej funkcji
//
// EOF
//