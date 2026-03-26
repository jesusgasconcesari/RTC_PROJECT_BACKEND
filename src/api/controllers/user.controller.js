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

        let imageUrl = null;
        let imagePublicId = null;
        if(req.file){
            const uploaded = await cloudinary.uploader.upload(req.file.path,{
                folder: 'users'
            });
            imageUrl = uploaded.secure_url;
            imagePublicId = uploaded.public_id;

        }

        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'user',
            image: imageUrl,
            imagePublicId: imagePublicId
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

       
        const userObj = updatedUser.toObject();
        delete userObj.password;
         console.log("Updated user:", userObj);
        return res.json(userObj);
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

        if(userToDelete.imagePublicId) {
            await cloudinary.uploader.destroy(userToDelete.imagePublicId);
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

        const userObj = userToUpdate.toObject();
        delete userObj.password;

        res.json({ message: 'User role updated successfully', user: userObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing user role' });
    }
};

const updateUser = async (req, res) => {
    try {
        const loggedUserId = req.user.id || req.user.userId;
        const loggedUserRole = req.user.role;
        const userIdToUpdate = req.params.id;

        if (loggedUserRole !== 'admin' && loggedUserId !== userIdToUpdate) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, password } = req.body;

        if (username) user.username = username;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }

        if (req.file) {

            if (user.imagePublicId) {
                await cloudinary.uploader.destroy(user.imagePublicId);
            }

            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: 'users'
            });

            user.image = uploaded.secure_url;
            user.imagePublicId = uploaded.public_id;
        }

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        res.json(userObj);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

module.exports = { register, login, addItemToUser, deleteUser, changeRole, updateUser};