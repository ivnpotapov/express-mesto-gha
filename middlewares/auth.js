const ErrorUnauthorized = require('../errors/ErrorUnauthorized');
const { checkToken } = require('../helpers/jwt');

module.exports.handleAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Необходима авторизация')); // 401
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = checkToken(token);
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация')); // 401
  }

  req.user = payload;

  next();
};
