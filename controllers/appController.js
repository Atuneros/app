//MODULO DE NODEJS PARA ENCRIPTAR
const bcrypt = require('bcrypt');

//IMPORTAMOS LOS MODELOS PARA LAS QUERYS
const User = require("../models/user")
const StockMarket = require("../models/stockMarket")

//SIRVE LA PAGINA DE INDEX SI EL USUARIO TIENE SESION ABIERTA
const login_index_get = (req, res) => {
    if(req.session.userId){
        res.render("index")
    }else{
        res.render("login")
    }
}

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
                //COMPARO LA CONTRASEÑA CON EL HASH ALMACENADO EN LA BBDD
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
    login_post,
    logout_post
}