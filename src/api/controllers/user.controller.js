require("dotenv").config();
const User = require('../models/User.js');
const Item = require('../models/Item.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../../config/cloudinary.js');


const register = async (req, res) => {
    try {
        const { username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'user',
            image: req.file ? req.file.path : null
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userObj = user.toObject();
        delete userObj.password;
        res.json({ token, user: userObj });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
};

const addItemToUser = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const { itemId } = req.body;

        console.log(userId);

        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }

        const itemExists = await Item.findById(itemId);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found' });
        }

        console.log("Updating userID:", userId, "with itemID:", itemId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { items: itemId } },
            { new: true }
        ).populate('items');

        console.log("Updated user:", updatedUser);

        return res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding item to user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const loggedUserId = req.user.id || req.user.userId;
        const loggedUserRole = req.user.role;
        const userIdToDelete = req.params.id;

        if(loggedUserRole !== 'admin' && loggedUserId !== userIdToDelete) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this user' });
        }

        const userToDelete = await User.findById(userIdToDelete);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(userToDelete.image) {
            const imageUrl = userToDelete.image;
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`useres/${publicId}`);
        }

        await User.findByIdAndDelete(userIdToDelete);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

const changeRole = async (req, res) => {
    try {
        const loggedUserId = req.user.id || req.user.userId;
        const loggedUserRole = req.user.role;
        const userIdToUpdate = req.params.id;
        const { role } = req.body;

        if(loggedUserRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can change user roles' });
        }

        if(loggedUserId === userIdToUpdate) {
            return res.status(400).json({ message: 'Bad Request: Admins cannot change their own role' });
        }

        if(!["admin", "user"].includes(role)) {
            return res.status(400).json({ message: 'Bad Request: Invalid role specified' });
        }
        const userToUpdate = await User.findById(userIdToUpdate);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        userToUpdate.role = role;
        await userToUpdate.save();
        res.json({ message: 'User role updated successfully', user: userToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing user role' });
    }
};

module.exports = { register, login, addItemToUser, deleteUser, changeRole };