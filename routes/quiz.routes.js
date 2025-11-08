import express from 'express'
import {
    getAllQuizData,
    createQuiz,
    getSpecificQuiz,
} from '../controllers/quiz.controllers.js';
import { isAdmin, verifyToken, isIdValid } from '../middleware/middlewares.js';


const router = express.Router();




router.get('/', getAllQuizData)
router.get('/:id', isIdValid, getSpecificQuiz)
router.post('/', verifyToken, isAdmin, createQuiz)

export default router