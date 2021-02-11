const express = require('express')
const app = express()
const port = 3000

const path = require('path')
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

var data = require('./datos_bolsa.json');

app.get("/loadData",function(request, response){
  response.header('Access-Control-Allow-Origin', "*");
  response.header('Access-Control-Allow-Methods', 'GET');
  response.header("Access-Control-Allow-Headers", "accept, content-type");
  response.header("Access-Control-Max-Age", "1728000");
  response.json(data)
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
