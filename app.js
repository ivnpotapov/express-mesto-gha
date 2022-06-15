const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesUsers = require('./routes/users');
const routesCards = require('./routes/cards');
const handleError = require('./errors/handleError');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a993c8514882de9c312717', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/cards', routesCards);
app.use('/users', routesUsers);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
