import express from 'express'
import {
    getAllQuizData,
    createQuiz,
    getSpecificQuiz,
    createQuestion,
    getSpecificQuestion,
    updateSpecificQuestion,
    deleteSpecificQuestion,
    submitAnswers,
    restartQuiz,
    deleteQuiz,
    updateQuiz
} from '../controllers/quiz.controllers.js';
import { isAdmin, verifyToken, isIdValid } from '../middleware/middlewares.js';
<<<<<<< HEAD
=======
import { checkApiKey } from '../middleware/middlewares.js';
>>>>>>> 76608ea0d1238272546883097e0e47daf0b8ba28

const router = express.Router();




router.get('/', checkApiKey, getAllQuizData)
router.route('/:id')
    .get(checkApiKey, isIdValid, getSpecificQuiz)
    .delete(checkApiKey, isIdValid, verifyToken, isAdmin, deleteQuiz)
    .put(checkApiKey, isIdValid, verifyToken, isAdmin, updateQuiz)
router.post('/', checkApiKey, verifyToken, isAdmin, createQuiz)
router.post('/:quizId/questions', checkApiKey, verifyToken, isAdmin, createQuestion)
router.post('/:quizId/questions/submit', checkApiKey, verifyToken, submitAnswers)
router.get('/:quizId/questions/restart', checkApiKey, verifyToken, restartQuiz)
router.route('/:quizId/questions/:questionId')
    .get(checkApiKey, verifyToken, getSpecificQuestion)
    .put(checkApiKey, verifyToken, isAdmin, updateSpecificQuestion)
    .delete(checkApiKey, verifyToken, isAdmin, deleteSpecificQuestion)

export default router