const Item = require('../models/Item.js');

// GET all items

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting items' });
    }
}

// GET item by ID

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        } else {
            res.json(item);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting item' });
    }
}

// POST create new item

exports.createItem = async (req, res) => {
   try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' });
        }

        const existingItem = await Item.findOne({ name });
        if (existingItem) {
            return res.status(409).json({ message: 'Item already exists' });
        }

        const newItem = new Item({ name, type });
        await newItem.save();

        res.status(201).json(newItem);
   } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating item' });
   }
}

// PUT update item by ID

exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        } else {
            res.json(updatedItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating item' });
    }
}

// DELETE item by ID

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item){
            return res.status(404).json({ message: 'Item not found' });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting item' });
    }
}


