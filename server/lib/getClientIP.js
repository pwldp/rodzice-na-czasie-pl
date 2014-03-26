//
// Patrz na:
// https://github.com/primaryobjects/remoteip/blob/master/lib/remoteip.js
//
module.exports = function getClientIP(request){ 
    with(request)
	return (headers['x-forwarded-for'] || '').split(',')[0] || connection.remoteAddress
}