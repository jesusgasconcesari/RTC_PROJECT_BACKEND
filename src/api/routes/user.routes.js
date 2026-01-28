const express = require('express');
const router = express.Router();
const { register, login, addItemToUser, deleteUser, changeRole} = require('../controllers/user.controller.js');
const { isAuth }= require('../../middlewares/auth.middleware.js');
const  upload = require('../../middlewares/upload.middleware.js');

router.post('/register', upload.single('image'), register);
router.post('/login', login);

router.patch('/add-item', isAuth, addItemToUser);
router.delete('/:id', isAuth, deleteUser);
router.patch('/role/:id', isAuth, changeRole);


module.exports = router;