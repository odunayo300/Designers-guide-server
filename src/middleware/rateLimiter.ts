const rateLimit = require("express-rate-limit");

const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // limit each IP to 5 requests per windowMs

    message: {
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const resendOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // limit each IP to 3 requests per windowMs

    message: {
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: "draft-8", // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { verifyEmailLimiter, resendOtpLimiter };