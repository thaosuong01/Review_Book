const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();

router.post("/sign-up", authController.signUp);
router.get("/verify/:email", authController.verifyAccount);

module.exports.authRoute = router;