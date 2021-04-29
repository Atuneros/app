const mongoose = require("mongoose")

const dbURI = ""
const conn = mongoose.createConnection(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartera:{
        type: Number,
        required: false
    },
    acciones:{
        type: Map,
        of: Number,
        required: false
    }
}, {timestamps: true})

//DEFINO LA COLECCION (LA PRIMERA EN MAYUSCULA) Y EL ESQUEMA QUE VOY A UTILIZAR PARA LAS QUERYS
const User = conn.model("User", userSchema)
module.exports = User