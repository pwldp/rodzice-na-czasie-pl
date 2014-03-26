/*
Przykład:

Łąka
Laska
*/

//
//module.exports = String.prototype.localeComparePL( str ){
String.prototype.localeComparePL = function( str2 ){ 
    
    var charsPL = new String("0123456789AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUWXYZŹŻaąbcćdeęfghijklłmnńoóprqsśtwuxyzźż");
    var str1 = this;
    //console.log("STR1="+str1);
    //console.log("STR2="+str2);
    
    //console.log("indexOf(a)="+charsPL.indexOf("'"));
    if (str1===undefined) return -1;
    if (str2===undefined) return 1;
    //
    if (str1==str2){
	return 0;
    } else {
	//console.log("Sa rozne...");
	// normalizuje dlugosc stringow
	var strMaxLen=0;
	if (str1.length>=str2.length){
	    strMaxLen = str1.length;
	    //
	    for (var i=str2.length; i<strMaxLen; i++) {
		str2=str2+" ";
	    }
	} else {
	    strMaxLen = str2.length;
	    //
	    for (var i=str1.length; i<strMaxLen; i++) {
		str1=str1+" ";
	    }
	};
	//console.log("strMaxLen="+strMaxLen);
	//console.log("STR1=["+str1+"]");
	//console.log("STR2=["+str2+"]");
	// wyznaczam 1 dla pozycji na ktorej w danym stringu jest 'wieksza litera'
	var str1Res="", str2Res="", str1tmp, str2tmp, str1val=0, str2val=0;
	for (var i=0; i<strMaxLen; i++) {
	    //console.log("Compare1:"+str1[i]+" <?> "+str2[i])
	    if (charsPL.indexOf(str1[i])>-1){
		str1tmp = charsPL.indexOf(str1[i]);
	    } else {
		str1tmp = 0;
	    };
	    //
	    if (charsPL.indexOf(str2[i])>-1){
		str2tmp = charsPL.indexOf(str2[i]);
	    } else {
		str2tmp = 0;
	    };
	    //
	    //console.log("Compare2:"+str1tmp+" <?> "+str2tmp)
	    if (str1tmp>str2tmp){
		str1Res+="1";
		str2Res+="0";
	    } else if (str1tmp<str2tmp) {
		str1Res+="0";
		str2Res+="1";
	    } else {
		str1Res+="0";
		str2Res+="0";
	    };
	    //console.log("Compare3:"+str1Res+" <?> "+str2Res)
	    str1val = parseInt(str1Res,2);
	    str2val = parseInt(str2Res,2);
	    //console.log("Compare4:"+str1val+" <?> "+str2val)
	}
	//
	if (str1val>str2val) return 1;
	if (str1val<str2val) return -1;
	return 0;
    }
}
//
module.exports = String.prototype.localeComparePL;
//
// EOF
//