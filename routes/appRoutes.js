const express = require("express")
const router = express.Router()

const appController = require("../controllers/appController")

//GET REQUESTS
router.get("/", appController.login_index_get)

//POST REQUESTS
router.post("/login", appController.login_post)
router.post("/logout", appController.logout_post)
router.post("/buy", appController.buy_post)
router.post("/sell", appController.sell_post)

module.exports = router
