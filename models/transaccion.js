const mongoose = require("mongoose")

const dbURI = "mongodb://editorUser:ClaveMongo666@15.188.13.160:27017/creds"
const conn = mongoose.createConnection(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})

const Schema = mongoose.Schema

const transaccionSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    acciones:{
        type: Number,
        required: true
    },
    valor:{
        type: Number,
        required: true
    },
    movimiento:{
        type: String,
        required: true
    }
        
}, {timestamps: true})

//DEFINO LA COLECCION (LA PRIMERA EN MAYUSCULA) Y EL ESQUEMA QUE VOY A UTILIZAR PARA LAS QUERYS
const Transaccion = conn.model("Transaccion", transaccionSchema)
module.exports = Transaccion