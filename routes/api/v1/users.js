const express = require("express");
const router = express.Router();

const { userController } = require("../../../controllers");


// User Registration route
router.post("/register", userController.register);

// User Generate Otp route
router.post("/generate-otp", userController.generateOtp);

// User Verify Otp and login route
router.post("/login", userController.verifyOtp);

module.exports = router;
