import express from 'express';
import { Login, Logout, SignUp } from '../controllers/auth.controllers.js';
import { checkApiKey } from '../middleware/middlewares.js';
const router = express.Router()

router.post('/login',checkApiKey, Login)
router.post('/signup',checkApiKey, SignUp)
router.post('/logout',checkApiKey, Logout)
export default router