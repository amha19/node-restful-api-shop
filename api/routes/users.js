const express = require('express');

const usersController = require('../controllers/users');
const authCheck = require('../middleware/check-auth');

const router = express.Router();

router.post('/signup', usersController.userSignup);

router.post('/login', usersController.userLogin);

router.get('/logout', authCheck, usersController.userLogout);

router.delete('/:userId', authCheck, usersController.deleteUser);
router.get('/', usersController.getAllUsers);

module.exports = router;
