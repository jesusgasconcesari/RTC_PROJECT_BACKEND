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

router.get('/', getAllItems);
router.get('/:id', getItemById);

router.post('/', isAuth, createItem);
router.put('/:id', isAuth, updateItem);
router.delete('/:id', isAuth, deleteItem);

module.exports = router;