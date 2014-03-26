//
// Rozsyła info, że uzytkownik sie polaczyl lub rozlaczyl
//
var ss = require("socketstream")
    , ServiceGroup = require("../schema/ServiceGroup")
    , ServiceGroupMember = require("../schema/ServiceGroupMember")
    ;
//
module.exports = function sendUserConnStatus(userId, isonline){ 
    console.log("sendUserConnStatus("+userId+","+isonline+")");
    if (!userId || userId==undefined){
	return false;
    };
    // szukam grupy 'friends' podanego uzsera
    ServiceGroup.checkExistsUsersFriendsGroup(userId, function(err, fgrp){
	if (fgrp){
	    // czytam czlonkow grupy 'friends'
	    ServiceGroupMember.find({group_id:fgrp._id}, function(err, sgmList){
		if (err) console.err("sendUserConnStatus::ERROR = Problem odczytu czlonkow  grupy 'friends' uzytkownika ID="+userId+", "+err);
		var tmpL = [];
		sgmList.forEach(function(item){
		    if (String(item.user_id)!=String(userId)){
			tmpL.push(item.user_id);
		    };
		});
		ss.api.publish.user(tmpL, 'ol', {uid:userId,ol:isonline});
	    });
	    return true;
	} else {
	    console.err("sendUserConnStatus::ERROR = Problem z grupa 'friends' uzytkownika ID="+userId);
	    return false;
	};
    });
    //
    
};

//
// EOF
//