const mongoose = require('mongoose');
const { type } = require('os');

const Schema = mongoose.Schema;

const itemSchema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, required: true }
    }
)

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;