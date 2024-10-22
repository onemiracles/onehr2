const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('base64');
console.log('Your JWT Secret Key:');
console.log(secretKey);