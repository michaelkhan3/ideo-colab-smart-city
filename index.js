const express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

// Serve the CSS as a static asset
app.use(express.static(__dirname + '/'))
app.use(express.static(__dirname + '/assets'))
app.use(express.static(__dirname + '/data'))
app.use(express.static(__dirname + '/images'))
app.use(express.static(__dirname + '/libraries'))
app.use(express.static(__dirname + '/assets'))
app.use(express.static(__dirname + '/scripts'))
app.use(express.static(__dirname + '/stylesheets'))

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html')
})

let count = 1
function pushDelayed () {
  console.log('-----> pushDelayed()')

  setTimeout(function () {
    const humidity = '5 %'

    io.emit('pushMessage', { humidity })

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