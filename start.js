//setup del server
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 3000

//codigo a migrar al implementar las rutas
const User = require("./models/user.js")

//conectar mongodb
const dbURI = "mongodb://editorUser:ClaveMongo666@15.188.13.160:27017/creds"
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log("Conectado a la BBDD"))
  .catch((err) => console.log(err))

//setup del motor de views
app.set("view engine", "pug")
app.set("views", process.cwd() + "/views")

//setup de la carpeta de acceso publico
const path = require("path")
app.use(express.static(path.join(__dirname, "public")));

//por eliminar y conectar con bbdd
var data = require("./datos_bolsa.json")

//index route
app.get("/", (req, res) => {
  res.render("index")

  const userTest = new User({
    username: "Joaquin",
    password: "12345"
  })
  userTest.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

//por eliminar y conectar con bbdd mediante ruta/controlador/modelo
app.get("/loadData",(req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", 'GET')
  res.header("Access-Control-Allow-Headers", "accept, content-type")
  res.header("Access-Control-Max-Age", "1728000")
  res.json(data)
})

//poner a escuchar la app, cambiar cuando conecte con mongo con mongoose como vi en el video
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
