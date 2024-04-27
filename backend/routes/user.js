const express = require('express');
const { registerUser,login, followUser, logout } = require('../controllers/user');
const { isAuthenticated } = require('../middlewares/auth');

const router =express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/follow/:id").get(isAuthenticated,followUser);
router.route("/logout").post(logout);

module.exports=router;