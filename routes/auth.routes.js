import express from 'express';
import { Login, Logout, SignUp } from '../controllers/auth.controllers.js';
<<<<<<< HEAD
=======
import { checkApiKey } from '../middleware/middlewares.js';
>>>>>>> 76608ea0d1238272546883097e0e47daf0b8ba28
const router = express.Router()

router.post('/login',checkApiKey, Login)
router.post('/signup',checkApiKey, SignUp)
router.post('/logout',checkApiKey, Logout)
export default router