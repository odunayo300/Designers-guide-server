const express = require('express');
const Router = express.Router();
const rateLimiter = require('../middleware/rateLimiter')
const verifyEmailController = require('../controller/verifyEmailController')

Router.post('/', rateLimiter.verifyEmailLimiter, verifyEmailController);

module.exports = Router; 