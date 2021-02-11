const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "pug")
app.set("views", process.cwd() + "/views")

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

var data = require('./datos_bolsa.json');

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/loadData",(req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header("Access-Control-Allow-Headers", "accept, content-type");
  res.header("Access-Control-Max-Age", "1728000");
  res.json(data)
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
