const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const handleError = require('./errors/handleError');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { createUser, login } = require('./controllers/users');
const { handleAuth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), handleAuth);

app.use('/cards', routesCards);
app.use('/users', routesUsers);
app.use('/*', () => {
  throw new ErrorNotFound('Путь не найден');
});
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {

});
