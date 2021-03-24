//MODULO DE NODEJS PARA ENCRIPTAR
const bcrypt = require('bcrypt');

//MODULO CACHE
const nodeCache = require("node-cache");
const cache = new nodeCache({stdTTL: 3600});

//IMPORTAMOS LOS MODELOS PARA LAS QUERYS
const User = require("../models/user")
const StockMarket = require("../models/stockMarket")

//COMPRUEBA SI HAY UNA SESION INICIADA PARA PERMITIR EL ACCESO
function checkSession(req){
    if(req.session.userId){
        return true
    }else{
        return false
    }
}

/*
    GET
*/

//SIRVE LA PAGINA DE INDEX SI EL USUARIO TIENE SESION ABIERTA
const login_index_get = (req, res) => {
    if(checkSession(req)){
        if(!cache.get("datos")){
            StockMarket.find({})
            .then((result) => {
                cache.set("datos", result)
                res.render("index", {data: cache.get("datos")})
            })
        }else{
            res.render("index", {data: cache.get("datos")})
        }
    }else{
        res.render("login")
    }
}

const data_get = (req, res) => {
    if(checkSession(req)){
        console.log(req.params.id)
        StockMarket.find({nombre: (req.params.id).toUpperCase()}).
        then((result) => {
            res.render("index", {data: result})
        })
    }else{
        res.redirect("/")
    }
}

/*
    POST
*/

//GESTIONA LAS PETICIONES DE LOGIN
const login_post = (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        User.findOne({username: req.body.email})
        .then((result) => {
            if(!result){
                const user = new User({
                    username: req.body.email,
                    password: hash,
                    cartera: 0
                })
                user.save()
                .then((result) => {
                    req.session.userId = req.session.id
                    res.redirect("/")
                })
            }else{
                //COMPARA LA CONTRASEÑA CON EL HASH ALMACENADO EN LA BBDD
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    req.session.userId = req.session.id
                    res.redirect("/")
                } else {
                    res.redirect("/")
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

//ELIMINA LA SESION DEL USUARIO
const logout_post = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}

//EXPORTA LAS FUNCIONES PARA SER USADAS POR EL ROUTER
module.exports = {
    login_index_get,
    data_get,
    login_post,
    logout_post
}