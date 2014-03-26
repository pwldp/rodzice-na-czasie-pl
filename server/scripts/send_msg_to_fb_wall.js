#!/usr/bin/env nodejs

var request = require('request');
var util = require("util");

var access_token="CAAHFWJu1ZAP4BAAMSLKJqS1hzui4Se5ndFl8aq7kIzBWwbcI0gevAzMa1Or9xc5lzZBsAcwf2tieBSyFt9Oara2AxbOCB818FF5L3ZBw2UZBM8qmNEBZBs6j1MjKvZCL95iuNfotEfw9qr1PAVXFBy";
/*
request('https://graph.facebook.com/me/permissions/?access_token='+access_token, function (error, response, body) {
    console.log("ERROR= "+error);
//  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
    var perms = JSON.parse(body)
    console.log(perms.data[0])
//  }
})
*/
/*
curl -F "access_token=$ACCESS_TOKEN" -F "message=Dołączyłem do serwisu RodziceNaCzasie.pl, skupiającego rodziców dzieci w wieku przedszkolnym i szkolnym. Przyłącz się do mnie." -F "link=http://rnc.rodzicenaczasie.pl" -F "name=RodziceNaCzasie" -F "caption=Przyłącz się do RodziceNaCzasie.pl" https://graph.facebook.com/me/feed
*/
/*
var form = {
    access_token: access_token,
    message: "Dołączyłem do serwisu RodziceNaCzasie.pl, skupiającego rodziców dzieci w wieku przedszkolnym i szkolnym.\nPrzyłącz się do mnie!",
    link: "http://rnc.rodzicenaczasie.pl",
    name: "RodziceNaCzasie",
    caption: "Przyłącz się do serwisu RodziceNaCzasie.pl",
};
request.post('https://graph.facebook.com/me/feed', {form:form}, function(err, resp, body){
    if (err) console.log("ERROR= "+err);
    console.log("RESP= "+util.inspect(resp));
    console.log("BODY= "+body);
});
*/


String.prototype.capitalize = function() {
    return this.toLowerCase().charAt(0).toUpperCase() + this.slice(1);
}

var origin_name = "facebook";
//origin_name = origin_name[0]+
console.log("origin_name="+origin_name.capitalize());


//
// EOF
//