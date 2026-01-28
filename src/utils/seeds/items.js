require('dotenv').config();

const items = require('../../data/items.js');
const Item = require('../../api/models/Item.js');
const mongoose = require('mongoose');

mongoose
    .connect(process.env.DB_URL)
    .then(async () => {
        const allItems = await Item.find();
        if (allItems.length) {
            await Item.collection.drop(); // Elimina la colección si ya existen datos
        }
    })
    .catch((err) => console.log('Error eliminando la colección:', err))
    .then(async () => {
        await Item.insertMany(items);
    })
    .catch((err) => console.log('Error insertando los items:', err))
    .finally(() => mongoose.disconnect());