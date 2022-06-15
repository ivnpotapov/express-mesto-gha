const router = require('express').Router();
const {
  getUsers, getUser, createUser, setUser, setUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', setUser);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
