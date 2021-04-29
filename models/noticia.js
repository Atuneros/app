const mongoose = require("mongoose")

const dbURI = ""
const conn = mongoose.createConnection(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})

const Schema = mongoose.Schema

const noticiaSchema = new Schema({
    titulo: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    cuerpo: {
        type: String,
        required: false
    }
}, {timestamps: true})

//DEFINO LA COLECCION (LA PRIMERA EN MAYUSCULA) Y EL ESQUEMA QUE VOY A UTILIZAR PARA LAS QUERYS
const Noticia = conn.model("Noticias", noticiaSchema)
module.exports = Noticia