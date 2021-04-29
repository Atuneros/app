//MODULO DE NODEJS PARA ENCRIPTAR
const bcrypt = require('bcrypt')

//MODULO CACHE
const nodeCache = require("node-cache")
const cache = new nodeCache({stdTTL: 3600})

//IMPORTAMOS LOS MODELOS PARA LAS QUERYS
const User = require("../models/user")
const StockMarket = require("../models/stockMarket")
const Noticia = require("../models/noticia")
const Transaccion = require("../models/transaccion")

//COMPRUEBA SI HAY UNA SESION INICIADA PARA PERMITIR EL ACCESO
function checkSession(req){
    if(req.session.userId){
        return true
    }else{
        return false
    }
}

//FUNCION AUXILIAR
const set_session_vars = (req, vars) => {
    req.session.userId = req.session.id
    req.session.userName = vars.username
    req.session.cartera = vars.cartera
    req.session.acciones = vars.acciones
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
                Noticia.find({}).sort({_id:-1}).limit(3)
                .then((noticias) => {
                    console.log("SE HA CONSULTADO LA BBDD")
                    cache.set("datos", [result, noticias.reverse()])
                    res.render("index", {data: cache.get("datos"), cartera: req.session.cartera, acciones: req.session.acciones})
                })
            })
        }else{
            res.render("index", {data: cache.get("datos"), cartera: req.session.cartera, acciones: req.session.acciones})
        }
    }else{
        res.render("login")
    }
}

//SIRVE LA PAGINA DE TRANSACCIONES SI EL USUARIO TIENE SESION ABIERTA
const transacciones_get = (req, res) => {
    if(checkSession(req)){
        Transaccion.find({username: req.session.userName}).sort({createdAt: -1})
        .then((result) => {
            res.render("transacciones", {data: result, cartera: req.session.cartera})
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
    if(!req.body.email || !req.body.password){
        res.redirect("/")
    }else{
        bcrypt.hash(req.body.password, 10, function(err, hash){
            User.findOne({username: req.body.email})
            .then((result) => {
                if(!result){
                    const user = new User({
                        username: req.body.email,
                        password: hash,
                        cartera: 0,
                        acciones: {}
                    })
    
                    user.save()
                    .then((result) => {
                        set_session_vars(req, result)
                        res.redirect("/")
                    })
                } else{
                    //COMPARA LA CONTRASEÑA CON EL HASH ALMACENADO EN LA BBDD
                    if (bcrypt.compareSync(req.body.password, result.password)) {
                        set_session_vars(req, result)
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
}

//ELIMINA LA SESION DEL USUARIO
const logout_post = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}

//FUNCION COMPRAR ACCIONES Y ALMACENAR EN BBDD
const buy_post = (req, res) => {
    StockMarket.findOne({nombre: req.body.empresa}).sort({_id: -1})
    .then((empresa) => {
        User.findOne({username: req.session.userName})
        .then((usuario) => {
            req.session.cartera = usuario.cartera - empresa.ultimo*req.body.totalAcciones
            req.session.acciones = usuario.acciones
            usuario.cartera = req.session.cartera
            empresa.nombre = empresa.nombre.split(".").join("")
            
            if(!usuario.acciones.get(empresa.nombre) && req.body.totalAcciones > 0){
                usuario.acciones.set(empresa.nombre, req.body.totalAcciones)
            }else if(req.body.totalAcciones > 0){
                usuario.acciones.set(empresa.nombre, parseInt(usuario.acciones.get(empresa.nombre))+parseInt(req.body.totalAcciones))
            }

            if(req.body.totalAcciones > 0){
                const transaccion = new Transaccion({
                    username: usuario.username,
                    empresa: empresa.nombre,
                    acciones: req.body.totalAcciones,
                    valor: req.body.valor,
                    movimiento: "Compra"
                })
                transaccion.save().
                then(() => {
                    usuario.save()
                    .then(() => {
                        res.json({cartera: req.session.cartera, acciones: usuario.acciones})
                    })
                })
            }
        })
    })
}

//FUNCION VENDER ACCIONES Y ALMACENAR EN BBDD
const sell_post = (req, res) => {
    StockMarket.findOne({nombre: req.body.empresa}).sort({_id: -1})
    .then((empresa) => {
        User.findOne({username: req.session.userName})
        .then((usuario) => {
            req.session.cartera = usuario.cartera + empresa.ultimo*req.body.totalAcciones
            req.session.acciones = usuario.acciones
            usuario.cartera = req.session.cartera
            empresa.nombre = empresa.nombre.split(".").join("")

            const transaccion = new Transaccion({
                username: usuario.username,
                empresa: empresa.nombre,
                acciones: req.body.totalAcciones,
                valor: req.body.valor,
                movimiento: "Venta"
            })

            if(usuario.acciones.get(empresa.nombre) && usuario.acciones.get(empresa.nombre) != 0 && parseInt(usuario.acciones.get(empresa.nombre))-parseInt(req.body.totalAcciones) >= 0){
                usuario.acciones.set(empresa.nombre, parseInt(usuario.acciones.get(empresa.nombre))-parseInt(req.body.totalAcciones))
                usuario.save()
                .then(() => {
                    transaccion.save().
                    then(() => {
                        res.json({cartera: req.session.cartera, acciones: usuario.acciones})
                    })
                })
            }
        })
    })
}

//EXPORTA LAS FUNCIONES PARA SER USADAS POR EL ROUTER
module.exports = {
    login_index_get,
    login_post,
    logout_post,
    buy_post,
    sell_post,
    transacciones_get
}