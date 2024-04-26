const express = require('express');
const { registerUser,login } = require('../controllers/user');

const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);

module.exports=router;