const jwt = require('jsonwebtoken');
const fs = require('file-system');

const privateKey = fs.readFileSync('./.private.key', 'utf8');
const fakeToken = jwt.sign({id: 123}, privateKey, {
  expiresIn: 3,
  algorithm: 'RS256',
});

module.exports = fakeToken;
