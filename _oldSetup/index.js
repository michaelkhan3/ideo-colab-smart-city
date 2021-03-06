const express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

// Serve the CSS as a static asset
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html')
})

let count = 1
function pushDelayed () {
  setTimeout(function () {
    io.emit('pushMessage', 'this is a push ' + count)
    count++

    if (count <= 10) {
      pushDelayed()
    } else {
      return
    }
  }, 1000)
}

io.on('connection', function (socket){
  console.log('a user connected')

  pushDelayed()
  
  socket.on('disconnect', function (){
    console.log('user disconnected')
  })
})

http.listen(3000, function (){
  console.log('listening on localhost:3000')
})