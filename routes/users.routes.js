import express from 'express'
import {
    changePassword,
    Profile,
    updateProfile,
    getAllUsers,
    getSpecificUser,
    deleteUser,
    toggleRole,
    uploadProfileImage
} from '../controllers/users.controllers.js';
<<<<<<< HEAD
import { verifyToken, isAdmin, isIdValid, upload, } from '../middleware/middlewares.js';
=======
import { verifyToken, isAdmin, isIdValid, upload, checkApiKey } from '../middleware/middlewares.js';
import { checkApiKey } from '../middleware/middlewares.js';
>>>>>>> 76608ea0d1238272546883097e0e47daf0b8ba28
const router = express.Router();

router.route('/profile')
    .get(checkApiKey,verifyToken, Profile)
    .put(checkApiKey,verifyToken, updateProfile)
    .delete(checkApiKey,verifyToken, deleteUser)
router.put('/profile/change-password', checkApiKey,verifyToken, changePassword)
router.get('/', checkApiKey,checkApiKey,verifyToken, isAdmin, getAllUsers)
router.get('/:id',checkApiKey, isIdValid, verifyToken, isAdmin, getSpecificUser)
router.put('/:id/role',checkApiKey, isIdValid, verifyToken, isAdmin, toggleRole)
router.put('/profile/upload-image',checkApiKey, verifyToken, upload.single('image'), uploadProfileImage);


export default router; 