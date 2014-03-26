//
// Wysylanie plikow
//
//
// https://github.com/rvagg/node-rsz
//
module.exports = function middSrvImage(options) {
    //
    var url = require("url")
	, fs = require("fs")
	, path = require("path")
	, conf = require("../../conf")
	, util = require("util")
	, FileMetaInfo = require('../schema/FileMetaInfo')
	;
    //
    function notFound(res){
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write('404 Not Found\n');
	res.end();
	return;
    }
    //
    // Zajmuje sie tylko i wylacznie serwowaniem podanego pliku
    // logike wpisac ponizej (obsluga minaturek)
    //
    function serveFile(req, res, filepath, filename, mimeType){
	//var fName = path.resolve(conf.filesDir, "Default.png");
	console.log("MIDD serwuje plik: "+filepath);
	//
	var stats;
	try {
	    stats = fs.lstatSync(filepath); // throws if path doesn't exist
	} catch (e) {
	    notFound(res);
	    return;
	}
	//
	//console.log("stats="+util.inspect(stats));
	if (stats.isFile()) {
	    // path exists, is a file
	    //var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
	    //var mimeType = "image/png";
	    res.writeHead(200, {
		'Content-Type': mimeType, 
		'Content-Length': stats.size,
		'Content-Disposition': 'inline; filename="'+filename+'"'	// attachment ?
	    } ); 
	    var fileStream = fs.createReadStream( filepath );
	    fileStream.pipe(res);
	    return;
	} else {
	    // exists but is directory
	    notFound(res);
	    return;
	}
	next();
    }
    //
    return function (req, res, next) {
	//console.log("MIDD: "+req.session.userId);
	if (req.session && req.session.userId) {
	    //console.log("MIDD: authorized?");
	    var params = url.parse(req.url, true)	
	    if (params.pathname==="/image" && req.method==="GET" ){
		//
		// odczyniam parametry wywolania
		//console.log("PARAMS="+ util.inspect(params));
		var file_id = null;
		if (params.query.id){
		    file_id = params.query.id;
		};
		//
		var file_type = null;
		if (params.query.t){
		    file_type = params.query.t;
		    switch (params.query.t)
		    {
			case 'a': file_type = 'avatar';
				break;
			case 'r': file_type = 'regular';
				break;
			case 't': file_type = 'thumbnail';
				break;
			default:  file_type = null;
		    }
		};
		//console.log("file_id="+file_id);
		//console.log("file_type="+file_type);
		//
		// avatar uzytkownika
		var user_id = null;
		if (!file_id && !file_type){
		    //console.log("oba null - avatar obecnego usera");
		    user_id = req.session.userId;
		}
		if (file_id && file_type==='avatar'){
		    //console.log("oba null - avatar usera id="+file_id);
		    user_id = file_id;
		}
		if (user_id) {
		    //
		    // serwuje avatara
		    console.log("serwuje avatara user_id="+user_id);
		    
		}
		//
		// plik regularny, 
		//
		// !!! NA RAZIE BRAK OBSLUGI WSPOLDZIELENIA !!!
		//
		if (file_id) {
		    if (file_type==='regular' || file_type===null || file_type==='thumbnail'){
			FileMetaInfo.findOne({_id: file_id}, function(err, fObj){
			    if (err) {
				console.log("blad");
				notFound(res);
			    } else {
				fObj.view_counter+=1;
				fObj.save();
				if (fObj) {
				    console.log("Jest plik"+fObj);
				    if (file_type==='thumbnail') {
					console.log("serwuje plik miniaturki file_id="+file_id);
					var filepath = path.join(conf.filesDir, fObj.path, 'thumb.jpg'); // tutaj mozna lepiej rozwiazac brak miniaturki dla pliku
				    } else {
					console.log("serwuje plik regularny file_id="+file_id);
					var filepath = path.join(conf.filesDir, fObj.path, 'file');
				    }
				    console.log("filepath: "+filepath);
				    serveFile(req, res, filepath, fObj.name, fObj.mimetype);
				} else {
				    console.log("Nie znalazlem pliku");
				}
			    };
			});
		    } else {
			notFound(res);
		    };
		}
		// serwuje plik domyślny jezeli nei zostaly spelnione zadne z powyzszych warunkow
		//
		var fName = "Default.png";
		var filepath = path.resolve(conf.filesDir, "Default.png");
		var mimeType = "image/png";
		//serveFile(req, res, filepath, fName, mimeType);
 	    } else {
		//res.writeHead(405, {'Content-Type': 'text/plain'});
		//res.end("405 Method Not Allowed\n");
		next();
 		//return;
	    };
	} else {
	/*
	    res.writeHead(403, {"Content-Type":"text/plain"});
	    res.end('403 Forbidden\n');
	    return;
	    */
	    next();
	}
    };
    
};