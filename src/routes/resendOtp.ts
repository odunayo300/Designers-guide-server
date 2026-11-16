const express = require('express');
const Router = express.Router();
const rateLimiter = require('../middleware/rateLimiter')
const resendOtpController = require('../controller/resendOtpController')

Router.post('/', rateLimiter.resendOtpLimiter, resendOtpController);

module.exports = Router;  