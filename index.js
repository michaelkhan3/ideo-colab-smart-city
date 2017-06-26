const express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const MongoClient = require('mongodb').MongoClient

const mongoUrl = 'mongodb://smartcity:citysmart@ds135812.mlab.com:35812/smart_city'


query_res = 0

function getAllReadings (db, callback) {
  const collection = db.collection('reading')

  collection.find({}).toArray(callback)
}

function getNReadings (db, n, callback) {
  const collection = db.collection('reading')

  collection.find().sort({_id:-1}).limit(n).toArray(callback)
}

MongoClient.connect(mongoUrl, function(error, db) {
  if (error) {
    console.log('Error: ', error)
    return
  }

  console.log('Connected to MongoDB!')
  //db.close()

  // Comment this back in if you want to see what's in the table
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


function pushData () {
  setTimeout(function () {

    MongoClient.connect(mongoUrl, function(error, db) {
      if (error) {
        console.log('Error: ', error)
        return
      }

      console.log('Connected to MongoDB!')

      // Comment this back in if you want to see what's in the table
      getNReadings(db, 1, function (error, readings) {
        if (error) {
          console.log('Error: ', error)
          return
        }

        console.log('Last N readings: ', readings)
        data = readings[0]






        io.emit('pushMessage', data)

        db.close()
      })
    })

    pushData()

  }, 5000)
}

// function pushData () {
//   setTimeout(function () {
//     const types = ['humidity', 'rain', 'gas', 'traffic', 'fire', 'flooding', 'co2', 'trafficJam']

//     const typesWithData = {}
//     types.forEach(function (type) {
//       let value = Math.floor((Math.random() * 100) + 1)

//       if (value < 10) {
//         value += 10
//       } else if (value > 70) {
//         value -= 30
//       }

//       typesWithData[type] = value + ' %'
//     })

//     // You can ignore this. It pushed data to the front end
//     io.emit('pushMessage', typesWithData)

//     pushData()
//   }, 15000)
// }

// This shows up in your terminal when you load the web page
io.on('connection', function (socket){
  console.log('a user connected')

  // This function gets called to display data
  pushData()
  
  socket.on('disconnect', function (){
    console.log('user disconnected')
  })
})

http.listen(process.env.PORT || 3000, function (){
  console.log('listening on localhost:3000')
})