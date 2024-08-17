// import asyncHandler from "async-handler";
import User from "../models/userModel.js";
import {generateToken} from "../utils/generateToken.js";

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(400);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
    // res.status(201).json({ message: 'Register User' });
};

const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User Logged out' });
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({users:user})
    
    // if (user) {
    //     res.status(200).json({
    // _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         profilePicture: user.profilePicture,
    //     });
    // } else {
    //     res.status(404).json({ message: 'User not found' });
    // }
};





const updateUserProfile = async (req, res) => {

    console.log(req.body)
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

   
        if (req.body.profilePicture) {
            user.profilePicture = req.body.profilePicture;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture, 
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};





export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};
