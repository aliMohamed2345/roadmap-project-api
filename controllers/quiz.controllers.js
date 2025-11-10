import { validateQuestionData } from "../utils/validateQuestionData.js";
import Question from "../models/question.model.js";
import Quiz from '../models/quiz.model.js'
import User from "../models/user.model.js";
import mongoose from "mongoose";
export const getAllQuizData = async (req, res) => {
    try {
        const quizData = await Quiz.find().populate(`questions`);

        if (!quizData.length)
            return res.status(404).json({
                success: false,
                message: "No quizzes available. Please add a new one."
            })


        return res.status(200).json({ success: true, quizData })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const getSpecificQuiz = async (req, res) => {
    try {
        const { id: quizId } = req.params;
        const questionNumber = req.query.question ? parseInt(req.query.question, 10) : null;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: "Invalid quiz ID." });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        // ✅ If the user wants a specific question
        if (questionNumber) {
            if (questionNumber <= 0 || questionNumber > quiz.questions.length) {
                return res.status(400).json({
                    success: false,
                    message: `Question number must be between 1 and ${quiz.questions.length}`,
                });
            }

            const questionId = quiz.questions[questionNumber - 1];
            const currentQuestion = await Question.findById(questionId);

            if (!currentQuestion) {
                return res.status(404).json({
                    success: false,
                    message: `Question ${questionNumber} not found.`,
                });
            }

            return res.status(200).json({
                success: true,
                quizId: quiz._id,
                totalQuestions: quiz.questions.length,
                questionNumber,
                currentQuestion,
            });
        }

        // ✅ If no question query 
        const populatedQuiz = await Quiz.findById(quizId).populate("questions");

        return res.status(200).json({
            success: true,
            quiz: populatedQuiz,
            totalQuestions: quiz.questions.length,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const createQuiz = async (req, res) => {
    try {
        const { title, description, rank } = req.body;
        const allRanks = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"]

        if (!title || !description || !rank)
            return res.status(400).json({ success: false, message: 'Title and description are required.' });

        if (!allRanks.includes(rank))
            return res.status(400).json({ success: false, message: `Rank must be one of following: ${allRanks.join(', ')}` })

        const wordCount = description.trim().split(/\s+/).length;
        if (wordCount < 5 || wordCount > 50)
            return res.status(400).json({
                success: false,
                message: 'Description must be between 5 and 50 words.'
            });

        const newQuiz = await Quiz.create({ title, description });

        return res.status(201).json({
            success: true,
            message: 'Quiz created successfully.',
            quiz: newQuiz
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const createQuestion = async (req, res) => {
    try {
        const { quizId } = req.params
        const { question, answer, options } = req.body

        //check the validation of the quizId
        if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ success: false, message: 'Invalid Id' });

        //validate the request body
        const { isValid, message } = validateQuestionData(question, answer, options)
        if (!isValid) return res.status(400).json({ success: false, message })

        //checking if the quiz exist 
        const isQuizExist = await Quiz.findById(quizId)
        if (!isQuizExist) return res.status(404).json({ success: false, message: `Quiz not found` })

        const newQuestion = await Question.create({ question, answer, options, quizId })

        //update the new question inside the quiz
        await Quiz.findByIdAndUpdate(quizId, { $push: { questions: newQuestion._id } })

        return res.status(201).json({ success: true, message: `Question created successfully`, newQuestion })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getSpecificQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        //checking the validation of the questionId
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ success: false, message: 'Invalid Id' });

        const question = await Question.findById(questionId);

        if (!question) return res.status(404).json({ success: false, message: `Question not found` });

        return res.status(200).json({ success: true, question });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export const UpdateSpecificQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { question, answer, options } = req.body
        const updatedData = {}

        //checking the validation of the questionId
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ success: false, message: 'Invalid Id' });

        //checking the validation of the request body
        const { isValid, message } = validateQuestionData(question, answer, options)
        if (!isValid) return res.status(400).json({ success: false, message })

        if (question) updatedData.question = question
        if (answer) updatedData.answer = answer
        if (options) updatedData.options = options

        //checking if the question exist 
        const isQuestionExist = await Question.findById(questionId)
        if (!isQuestionExist) return res.status(404).json({ success: false, message: `Question not found` })

        await Question.findByIdAndUpdate(questionId, updatedData)

        return res.status(200).json({ success: true, message: `Question updated successfully` })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const DeleteSpecificQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        //checking the validation of the questionId
        if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ success: false, message: 'Invalid Id' });

        const question = await Question.findByIdAndDelete(questionId)

        if (!question)
            return res.status(404).json({ success: false, message: `Question not found` });


        await Quiz.updateOne(
            { _id: question.quizId },
            { $pull: { questions: questionId } }
        );

        return res.status(200).json({ success: true, message: `Question deleted successfully` })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const submitAnswers = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;
        const { id: userId } = req.user;

        // Validation
        if (!answers || !Array.isArray(answers) || answers.length === 0)
            return res.status(400).json({ success: false, message: "Please provide a non-empty answers array." });
        if (!mongoose.Types.ObjectId.isValid(quizId))
            return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });

        // Get quiz with questions
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz)
            return res.status(404).json({ success: false, message: `Quiz not found.` });

        // Calculate results
        let correctAnswers = 0;
        const totalQuestions = quiz.questions.length;

        const answerDetails = quiz.questions.map((question) => {
            const userAnswer = answers.find(a => a.questionId === question._id.toString());
            const isCorrect = userAnswer && userAnswer.answer === question.answer;
            if (isCorrect) correctAnswers++;
            return {
                questionId: question._id,
                question: question.question,
                userAnswer: userAnswer ? userAnswer.answer : null,
                correctAnswer: question.answer,
                isCorrect,
            };
        });

        const wrongAnswers = totalQuestions - correctAnswers;
        const percentage = parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2));

        // Determine grade
        let grade;
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else grade = "F";

        const status = grade === "F" ? "Failed" : "Passed";

        // Save progress in user
        const progressData = {
            quiz: quizId,
            percentage,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            grade,
            status,
        };

        await User.findByIdAndUpdate(userId, {
            $push: { "progressData.quiz": progressData }
        });

        // Response with populated quiz info
        const updatedUser = await User.findById(userId)
            .select('-password -__v')
            .populate('progressData.quiz.quiz');

        return res.status(200).json({
            success: true,
            message: "Quiz submitted successfully.",
            result: {
                quizId,
                quizTitle: quiz.title,
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                percentage,
                grade,
                status,
                answerDetails,
            },
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const restartQuiz = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { quizId } = req.params; 

        // Validate quizId
        if (!quizId) {
            return res.status(400).json({ success: false, message: "Quiz ID is required." });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        // Remove that quiz progress
        user.progressData.quiz = user.progressData.quiz.filter(
            q => q.quiz.toString() !== quizId
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Quiz progress has been reset. You can now restart the quiz."
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
