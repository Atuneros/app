const bcrypt = require('bcrypt');

const User = require("../models/user")

const user_create_get = () => {

}

const login_index = (req, res) => {
    res.render("login")  
}

const login = (req, res) => {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        const userTest = new User({
            username: req.body.email,
            password: hash
          })
          //PARA INSERTAR EL USUARIO UTILIZAR userTest.save() + EL .then Y .catch DE ABAJO
          //CON ESTO BUSCO EN LA BBDD DE USER
          User.findOne({username:req.body.email})
            .then((result) => {
              console.log(result.password)
              //CON ESTO COMPARO LA CONTRASEÑA CON EL HASH ALMACENADO EN LA BBDD
              if (bcrypt.compareSync(req.body.password, result.password)) {
                console.log("MATCH")
               } else {
                console.log("DOES NOT MATCH")
               }
            })
            .catch((err) => {
              console.log(err)
            })
    })
    res.render("index")
    
}

const logout = (req, res) => {
    res.render("index")
}

module.exports = {
    login_index,
    login,
    logout
}