const express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const MongoClient = require('mongodb').MongoClient

const mongoUrl = 'mongodb://smartcity:citysmart@ds135812.mlab.com:35812/smart_city'

function getAllReadings (db, callback) {
  const collection = db.collection('reading')

  collection.find({}).toArray(callback)
}

MongoClient.connect(mongoUrl, function(error, db) {
  if (error) {
    console.log('Error: ', error)
    return
  }

  console.log('Connected to MongoDB!')

  getAllReadings(db, function (error, readings) {
    if (error) {
      console.log('Error: ', error)
      return
    }

    console.log('All readings: ', readings)

    db.close()
  })
})

// Collection: reading

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
function pushData () {
  setTimeout(function () {

    // Set this to new data, it'll show up on the web page
    const humidity = '1 %'
    const rain = '2 %'
    const gas = '3 %'
    const traffic = '4 %'
    const fire = '5 %'
    const flooding = '6 %'
    const co2 = '7 %'
    const trafficJam = '8 %'

    // You can ignore this. It pushed data to the front end
    io.emit('pushMessage', { 
      humidity,
      rain,
      gas,
      traffic,
      fire,
      flooding,
      co2,
      trafficJam
    })
  }, 1000)
}

// This shows up in your terminal when you load the web page
io.on('connection', function (socket){
  console.log('a user connected')

  // This function gets called to display data
  pushData()
  
  socket.on('disconnect', function (){
    console.log('user disconnected')
  })
})

http.listen(3000, function (){
  console.log('listening on localhost:3000')
})