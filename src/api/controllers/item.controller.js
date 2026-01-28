const Item = require('../models/Item.js');

// GET all items

exports.getAllItems = async (req, res) => {
    const items = await Item.find();
    res.json(items);
}

// GET item by ID

exports.getItemById = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    } else {
        res.json(item);
    }
}

// POST create new item

exports.createItem = async (req, res) => {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
}

// PUT update item by ID

exports.updateItem = async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
    } else {
        res.json(updatedItem);
    }
}

// DELETE item by ID

exports.deleteItem = async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
}


