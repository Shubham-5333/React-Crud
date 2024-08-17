import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv'

dotenv.config();
const protect = async (req, res, next) => {
    let token;

    
    token = req.cookies.jwt;

    if (token) {
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');

          
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
const protectAdmin = async (req, res, next) => {
    let token;
    if (req.cookies.jwtadmin) {
        try {
            token = req.cookies.jwtadmin;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role === 'admin') {
                req.user = decoded; 
                next();
            } else {
                res.status(401).json({ message: 'Not authorized as an admin' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


export { protect,protectAdmin };
