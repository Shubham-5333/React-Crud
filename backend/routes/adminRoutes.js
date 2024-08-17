import express from 'express';
const router = express.Router();
import {
    authAdmin,
    logoutAdmin,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/adminContoller.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

router.post('/auth', authAdmin);
router.post('/logout', protectAdmin, logoutAdmin);
router.route('/loadusers')
    .get(protectAdmin, getUsers)
    .post(protectAdmin, createUser);
router.route('/users/:id')
    .put(protectAdmin, updateUser)
    .delete(protectAdmin, deleteUser);

export default router;
