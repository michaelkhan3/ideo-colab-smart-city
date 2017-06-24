const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})