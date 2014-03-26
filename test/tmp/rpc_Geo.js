// in /test/app.js
var ss = require('socketstream').start();

describe('rpc_Geo.getListVoivodeships', function(){

  it('should get list o voivodeships', function(done){

    ss.rpc('rpc_Geo.getListVoivodeships', 4, function(params){
      params.toString().should.equal('16');
      done();
    });

  });

});
