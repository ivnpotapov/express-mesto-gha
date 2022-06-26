const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret';

module.exports.generateToken = (payload) => jwt.sign({ _id: payload }, SECRET_KEY, { expiresIn: '7d' });

module.exports.checkToken = (token) => jwt.verify(token, SECRET_KEY);
