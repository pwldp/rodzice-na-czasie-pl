//
// test funkcji autoryzacji
//
var ass = require('socketstream');

var ss = ass.start();

describe('authorization.linuser', function(){

  it('should login user DEMO1', function(done){
    //this.timeout(15000);
    ss.rpc('authorization.linuser', 'demo1', function(params){
      params.toString().should.equal('true');
      done();
    });

  });

});