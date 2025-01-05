const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController"); 

// Route pour l'inscription d'un utilisateur
router.post("/register", authController.register);

// Route pour la vérification de l'email via un token
router.get("/verify-email", authController.verifyEmail);

// Route pour la connexion d'un utilisateur
router.post("/login", authController.login);

// Route pour la verification d'un OTP
router.post("/verify-otp", authController.verifyOTP);


module.exports = router;
