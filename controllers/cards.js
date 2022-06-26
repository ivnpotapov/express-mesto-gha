const Card = require('../models/card');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorForbidden = require('../errors/ErrorForbidden');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(card._id);
      } else {
        next(new ErrorForbidden('Нельзя удалять карточки другого пользователя'));
      }

      return false;
    })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Передан несуществующий _id карточки'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Передан несуществующий _id карточки'));
      } else if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
      } else {
        next(err);
      }
    });
};
