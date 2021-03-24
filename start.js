//SETUP GENERAL DEL SERVER
const express = require("express")
const app = express()
const port = 3000




//SETUP SESIONES
const session = require("express-session");
app.use(session({
    secret: ["secretoImportante", "secretoNoMuyImportante", "secretoMuyImportante"],
    saveUninitialized: false,
    resave: false,
    name: "nombreSecreto",
    cookie: {
        maxAge: 86400000, //TIEMPO EN MILISEGUNDOS (1 DIA)
        secure: false,
        httpOnly: false
    }
}))

//SETUP DEL MOTOR DE VIEWS
app.set("view engine", "pug")
app.set("views", process.cwd() + "/views")

//SETUP DE LA CARPETA DE ACCESO PUBLICO
const path = require("path")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended : true}))

//SETUP RUTAS
const appRoutes = require("./routes/appRoutes")
app.use(appRoutes)

//PONER EL SERVIDOR A ESCUCHAR EN EL PUERTO
app.listen(port, () => {console.log("Listening...")})