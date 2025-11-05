import express from 'express';
import { Login, Logout, Profile, SignUp } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router()

router.post('/login', Login)
router.post('/signup', SignUp)
router.post('/logout', Logout)
router.get('/profile', verifyToken, Profile)
export default router