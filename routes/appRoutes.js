const express = require("express")
const router = express.Router()

const appController = require("../controllers/appController")

//GET requests
router.get("/", appController.login_index)
router.get("/logout", appController.logout)

//POST requests
router.post("/login", appController.login)

module.exports = router