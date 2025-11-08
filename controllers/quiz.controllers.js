import Quiz from "../models/quiz.model.js"


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
        const { id: quizId } = req.params
        const quiz = await Quiz.findById(quizId).populate(`questions`)

        if (!quiz) return res.status(404).json({ success: false, message: `Quiz not found` })

        return res.status(200).json({ success: true, quiz })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const createQuiz = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description)
            return res.status(400).json({ success: false, message: 'Title and description are required.' });

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
