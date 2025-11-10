import express from 'express'
import {
    getAllQuizData,
    createQuiz,
    getSpecificQuiz,
    createQuestion,
    getSpecificQuestion,
    UpdateSpecificQuestion,
    DeleteSpecificQuestion,
    submitAnswers,
    restartQuiz
} from '../controllers/quiz.controllers.js';
import { isAdmin, verifyToken, isIdValid } from '../middleware/middlewares.js';


const router = express.Router();




router.get('/', getAllQuizData)
router.get('/:id', isIdValid, getSpecificQuiz)
router.post('/', verifyToken, isAdmin, createQuiz)
router.post('/:quizId/questions', verifyToken, isAdmin, createQuestion)
router.post('/:quizId/questions/submit', verifyToken, submitAnswers)
router.get('/:quizId/questions/restart', verifyToken, restartQuiz)
router.route('/:quizId/questions/:questionId')
    .get(verifyToken, getSpecificQuestion)
    .put(verifyToken, isAdmin, UpdateSpecificQuestion)
    .delete(verifyToken, isAdmin, DeleteSpecificQuestion)

export default router