const mongoose = require('mongoose');
// const { PassThrough } = require('stream');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: { type: String, required: true , unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        image: { type: String },
        items: [{ type: mongoose.Types.ObjectId, ref: 'Item' }]
    }
)

const User = mongoose.model('User', userSchema);
module.exports = User;
