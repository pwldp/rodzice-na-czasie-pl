/*    
var testUser = new ServiceUser({
    username: 'jmar777123333',
    password: 'Password123',
    first_name: 'Firstname',
});
testUser.save( function(err){console.log("blad zapisu?"); if (err) throw err;});
*/
var d1 = new ServiceUser({
    username: 'demo1',
    password: '1omed',
    first_name: 'Konto1',
    last_name: 'Demo1',
    email: 'demo1@demo.de',
    phone: '+48123456789',
    gender: 'male'
});
d1.save( function(err){console.log("zapis: demo1"); if (err) throw err;});

var d2 = new ServiceUser({
    username: 'demo2',
    password: '2omed',
    first_name: 'Konto2',
    last_name: 'Demo2',
    email: 'demo2@demo.de',
    phone: '+48123456789',
    gender: 'male'
});
d2.save( function(err){console.log("zapis: demo2"); if (err) throw err;});

var d3 = new ServiceUser({
    username: 'demo3',
    password: '3omed',
    first_name: 'Konto3',
    last_name: 'Demo3',
    email: 'demo3@demo.de',
    phone: '+48123456789',
    gender: 'male'
});
d3.save( function(err){console.log("zapis: demo3"); if (err) throw err;});
}
