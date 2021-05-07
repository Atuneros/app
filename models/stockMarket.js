const mongoose = require("mongoose")

const dbURI = "mongodb://admin:ClaveMongo13579@atuncito.ddnsfree.com:7070/bolsa"
const conn = mongoose.createConnection(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})

const Schema = mongoose.Schema

const stockMarketSchema = new Schema({
    nombre: {
        type: String,
        required: false
    },
    fecha: {
        type: String,
        required: false
    },
    hora:{
        type: String,
        required: false
    },
    ultimo:{
        type: Number,
        required: false
    },
    "%dif":{
        type: Number,
        required: false
    },
    max:{
        type: Number,
        required: false
    },
    min:{
        type: Number,
        required: false
    },
    volumen:{
        type: Number,
        required: false
    },
    efectivo:{
        type: Number,
        required: false
    }
}, {timestamps: true})

//DEFINO LA COLECCION (LA PRIMERA EN MAYUSCULA) Y EL ESQUEMA QUE VOY A UTILIZAR PARA LAS QUERYS
const StockMarket = conn.model("Datos", stockMarketSchema)
module.exports = StockMarket