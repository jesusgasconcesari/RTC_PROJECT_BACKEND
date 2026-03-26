const express = require('express');
const router = express.Router();

const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/item.controller.js');

const { isAuth } = require('../../middlewares/auth.middleware.js');

router.get('/items', getAllItems);
router.get('/items/:id', getItemById);

router.post('/items', isAuth, createItem);
router.put('/items/:id', isAuth, updateItem);
router.delete('/items/:id', isAuth, deleteItem);

module.exports = router;