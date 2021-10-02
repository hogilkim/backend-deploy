const express = require('express');

const UserController = require('../controllers/UserController');
const validator = require('../helper/validator');

const router = express.Router();

router.post('/signup', validator.validSignUp, UserController.signup);
router.post('/activation', UserController.activate);

router.post('/login', validator.validLogin, UserController.login);
router.post('/forgetPassword', UserController.forgetPassword);
router.put('/resetPassword', UserController.resetPassword);

module.exports = router;