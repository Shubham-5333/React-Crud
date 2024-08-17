
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import { generateAdminToken } from '../utils/generateToken.js';


dotenv.config();

const adminCredentials = {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
};
const authAdmin = async (req, res) => {


    try {
        // console.log(req.body,adminCredentials);
        const { email, password } = req.body;
    
        if (email === adminCredentials.adminEmail && password === adminCredentials.adminPassword) {
            generateAdminToken(res,"admin")
            res.status(201).json({
                email: adminCredentials.adminEmail   
    
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error)
    }

};
const logoutAdmin = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Admin logged out' });
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
  
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export {
    authAdmin,
    logoutAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
