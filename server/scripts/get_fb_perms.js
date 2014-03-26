#!/usr/bin/env nodejs

var request = require('request');

var access_token="CAAHFWJu1ZAP4BAJQTqdNb443egnMHTwUmw8dJugQBriZCbsfibNEqjXBte8KZCRfrGylPX7tDExzUiI8XOuIXTYKyTugVoyGh9EUylo6xckwSKjcnZCK5qdDNPgZBwg2me12rx1qHC0if29yQlVLr";

request('https://graph.facebook.com/me/permissions/?access_token='+access_token, function (error, response, body) {
    console.log("ERROR= "+error);
//  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
    var perms = JSON.parse(body)
    console.log(perms.data[0])
//  }
})

//
// EOF
//