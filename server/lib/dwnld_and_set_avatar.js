//
// Pobiera obrazek z podanego URL i ustawia go jako avatar uzytkownika
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2012.12.12
//
// making a POST with NODEjs: http://www.theroamingcoder.com/node/111
//
var http = require('http-get')
    , request = require('request')
    , fs = require('fs')
    , path = require('path')
    , uuid = require('node-uuid')
    , gm = require('gm')
    , XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
    , sys = require('util')
    ;
//
module.exports = function dwnld_and_set_avatar(url, user_id){
    console.log("Wystartowal dwnld_and_set_avatar...");
    //
    //
    var validFileTypes = ['JPEG','PNG','GIF'];
    //
    var tmpFileName = '';
    while (true){
	tmpFileName = path.join('/tmp', uuid.v1());
	console.log("tmpFileName="+tmpFileName);
	if (!fs.existsSync(path)) break;
    };
    // czytam plik
    var options = {
	url: url, 
	bufferType: "buffer"
    };
    http.get(options, tmpFileName, function (error, result) {
	if (error) {
	    console.error(error);
	} else {
	    console.log('File downloaded at: ' + result.file);
	    console.log("spr. czy pobrany plik jest obrazkiem");
	    gm( tmpFileName ).identify(function(err, features){
		if (err) {
		    console.log("TO NIE JEST OBRAZEK: "+err);
		    // return cb(err); - to nei dziala
		    //
		    // Tutaj powinna byc jakas obsluga przypadku, gdy nie zostal pobrany obrazek;
		    // np.: wyslanie powiadomienia do uzytkownika
		    //
		    return false;
		} else {
		    console.log("Pobrano plik typu:"+features.format);
		    //return cb(null);
		    if (validFileTypes.indexOf(features.format)!==-1){
			console.log("Jest plik na AVATAR");
			/*
			xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://212.160.117.245:8080/upldavt', true);
			//xhr.setRequestHeader('X-File-Name', file.name);
			//xhr.setRequestHeader('X-File-Size', file.size);
			//xhr.setRequestHeader('Content-Type', file.type);
			xhr.onreadystatechange = function() {
			sys.puts("State: " + this.readyState);

			if (this.readyState == 4) {
			sys.puts("Complete.\nBody length: " + this.responseText.length);
			sys.puts("Body:\n" + this.responseText);
			}
			};
			
			xhr.send("1");
			*/
			
			var FIELDS = [
			    {name: 'avatar_file', value: fs.createReadStream( tmpFileName )},
			    {name: 'user_id', value: 666 }
			];
			
			var req = request.post('http://212.160.117.245:8080/upldavt', function (err, res) {
			    //server.close();
			    console.log("Koniec przesylu?"+sys.inspect(res.body));
			    return true;
			    next();
			})
			
			var form = req.form()
			
			FIELDS.forEach(function(field) {
			    form.append(field.name, field.value);
			});
			
			
			return true;
		    };
		};
	    }); // do gm
	}
    }); // do http.get
    
};
//
// EOF
//