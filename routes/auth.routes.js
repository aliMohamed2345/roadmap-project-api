import express from 'express';
import { Login, Logout, Profile, SignUp } from '../controllers/auth.controllers.js';


const router = express.Router()

router.post('/login', Login)
router.post('signup', SignUp)
router.post('Logout', Logout)
router.get('/profile', Profile)

export default router