module.exports = function StreamBuffer(req) {
  var self = this

  var buffer = []
  var ended  = false
  var ondata = null
  var onend  = null

  self.ondata = function(f) {
    for(var i = 0; i < buffer.length; i++ ) {
      f(buffer[i])
    }
    ondata = f
  }

  self.onend = function(f) {
    onend = f
    if( ended ) {
      onend()
    }
  }

  req.on('data', function(chunk) {
    if( ondata ) {
      ondata(chunk)
    }
    else {
      buffer.push(chunk)
    }
  })

  req.on('end', function() {
    ended = true
    if( onend ) {
      onend()
    }
  })        
 
  req.streambuffer = self
}