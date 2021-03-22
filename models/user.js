const mongoose = require("mongoose")

const dbURI = "mongodb://editorUser:ClaveMongo666@15.188.13.160:27017/creds"
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
    }
}, {timestamps: true})

const User = conn.model("User", userSchema)
module.exports = User