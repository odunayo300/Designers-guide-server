
const {randomInt} = require("node:crypto")

const generateOtp = (): string => {
    return randomInt(0, 1_000_000).toString().padStart(6, "0")
}

module.exports = generateOtp;